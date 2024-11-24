import { Markup } from "telegraf";
import { t, languages } from "./localization.js";
import {
  loadUserState,
  saveUserState,
  deleteUserState,
  getRedisClient,
} from "./redisState.js";
import { encrypt, decrypt } from "./encryption.js";
import { quais } from "quais";

const redis = getRedisClient();

export function setupBotHandlers(bot, provider) {
  // Middleware для загрузки состояния пользователя
  bot.use(async (ctx, next) => {
    if (ctx.from) {
      const userId = ctx.from.id;
      const userState = await loadUserState(userId);
      ctx.state.user = userState || {};
    }
    return next();
  });

  // Команда /start
  bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const userState = ctx.state.user;

    if (!userState.language) {
      await promptLanguageSelection(ctx);
    } else {
      await sendMainMenu(ctx, t(userState.language, "welcome"));
    }
  });

  // Команда /language
  bot.command("language", async (ctx) => {
    await promptLanguageSelection(ctx);
  });

  // Обработка выбора языка
  bot.action(/^language_(en|ru|zh)$/, async (ctx) => {
    const languageCode = ctx.match[0].split("_")[1];
    const userId = ctx.from.id;
    const userState = ctx.state.user;
    userState.language = languageCode;
    await saveUserState(userId, userState);
    await sendMainMenu(ctx, t(languageCode, "welcome"));
  });

  // Обработка нажатия на кнопку "Главное меню"
  bot.hears(
    (text, ctx) => text === t(ctx.state.user.language, "main_menu"),
    async (ctx) => {
      await sendMainMenu(ctx);
    }
  );

  // Обработка текстовых сообщений
  bot.on("text", async (ctx) => {
    const userId = ctx.from.id;
    const { steps, language } = ctx.state.user;

    if (!steps) return;

    if (steps.step === "enter_address") {
      try {
        quais.validateAddress(ctx.message.text);
        steps.address = ctx.message.text;
        steps.step = "enter_amount";
        await ctx.deleteMessage(ctx.message.message_id);
        await updateUserState(userId, { steps });
        await sendAndDeletePreviousMessage(
          ctx,
          t(language, "enter_amount"),
          Markup.inlineKeyboard([
            Markup.button.callback(t(language, "back"), "send"),
          ])
        );
      } catch (error) {
        await sendAndDeletePreviousMessage(
          ctx,
          t(language, "invalid_address"),
          Markup.inlineKeyboard([
            Markup.button.callback(t(language, "back"), "send"),
          ])
        );
      }
    } else if (steps.step === "enter_amount") {
      const amount = ctx.message.text;
      let amount_msg = "0";
      // Проверка суммы
      if (amount.toLowerCase() !== "all") {
        const parsedAmount = Number(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          return sendAndDeletePreviousMessage(
            ctx,
            t(language, "invalid_amount"),
            Markup.inlineKeyboard([
              Markup.button.callback(t(language, "back"), "enter_address"),
            ])
          );
        }
        steps.amount = parsedAmount.toString();
        amount_msg = parsedAmount.toString();
      } else {
        steps.amount = "all";
        const encryptedKey = await redis.get(`user:${ctx.from.id}:privkey`);
        if (!encryptedKey) {
          return sendAndDeletePreviousMessage(
            ctx,
            t(language, "no_private_key"),
            Markup.inlineKeyboard([
              Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
            ])
          );
        }
        let privkey = decrypt(encryptedKey);
        const wallet = new quais.Wallet(privkey, provider);
        privkey = null;
        const from = await wallet.getAddress();
        const balance = await provider.getBalance(from, "latest");
        amount_msg = quais.formatQuai(balance).toString();
      }

      steps.step = "confirm";
      await ctx.deleteMessage(ctx.message.message_id);
      await updateUserState(userId, { steps });
      await sendAndDeletePreviousMessage(
        ctx,
        t(language, "confirm_send", {
          amount: amount_msg,
          address: steps.address,
        }),
        Markup.inlineKeyboard([
          Markup.button.callback(t(language, "confirm"), "confirm_send"),
          Markup.button.callback(t(language, "back"), "send"),
        ])
      );
    } else if (steps.step === "save_key") {
      let privkey = ctx.message.text;
      try {
        await ctx.deleteMessage(ctx.message.message_id);
        const wallet = new quais.Wallet(privkey, provider);
        const address = await wallet.getAddress();
        const encryptedKey = encrypt(privkey);
        privkey = null;
        await redis.set(`user:${ctx.from.id}:privkey`, encryptedKey);
        await sendAndDeletePreviousMessage(
          ctx,
          t(language, "private_key_saved", { address }),
          Markup.inlineKeyboard([
            Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
          ])
        );
        await updateUserState(userId, { steps: null });
      } catch (error) {
        await sendAndDeletePreviousMessage(
          ctx,
          t(language, "invalid_private_key"),
          Markup.inlineKeyboard([
            Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
          ])
        );
      }
    }
  });

  // Обработка нажатия на кнопку "Отправить"
  bot.action("send", async (ctx) => {
    const userId = ctx.from.id;
    const language = ctx.state.user.language || "en";

    const steps = { step: "enter_address" };
    await updateUserState(userId, { steps });

    await sendAndDeletePreviousMessage(
      ctx,
      t(language, "enter_address"),
      Markup.inlineKeyboard([
        Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
      ]),
      true
    );
  });

  // Обработка подтверждения отправки
  bot.action("confirm_send", async (ctx) => {
    const userId = ctx.from.id;
    const { steps, language } = ctx.state.user;

    if (!steps || steps.step !== "confirm") return;

    const { address, amount } = steps;
    await updateUserState(userId, { steps: null });

    try {
      const encryptedKey = await redis.get(`user:${ctx.from.id}:privkey`);
      if (!encryptedKey) {
        return sendAndDeletePreviousMessage(
          ctx,
          t(language, "no_private_key"),
          Markup.inlineKeyboard([
            Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
          ])
        );
      }
      let privkey = decrypt(encryptedKey);

      const wallet = new quais.Wallet(privkey, provider);
      privkey = null;
      const from = await wallet.getAddress();

      // Проверка на незавершенные транзакции
      const lastTxHash = await redis.get(`user:${ctx.from.id}:${from}:lastTxHash`);
      if (lastTxHash) {
        try {
          await ensureTransactionProcessed(lastTxHash, provider, language);
        } catch (error) {
          return sendAndDeletePreviousMessage(
            ctx,
            t(language, "error", { error: error.message }),
            Markup.inlineKeyboard([
              Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
            ])
          );
        }
      }

      const balance = await provider.getBalance(from, "latest");
      const feeData = await provider.getFeeData(quais.Shard.Cyprus1);
      const gasPrice = feeData.gasPrice;
      const gasLimit = 100000n;
      const gasCost = gasPrice * gasLimit;

      if (balance <= gasCost) {
        return sendAndDeletePreviousMessage(
          ctx,
          t(language, "insufficient_funds"),
          Markup.inlineKeyboard([
            Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
          ])
        );
      }

      let valueToSend;
      if (amount.toLowerCase() === "all") {
        valueToSend = balance - gasCost;
      } else {
        const parsedAmount = quais.parseQuai(amount);
        if (parsedAmount + gasCost > balance) {
          return sendAndDeletePreviousMessage(
            ctx,
            t(language, "insufficient_funds_amount"),
            Markup.inlineKeyboard([
              Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
            ])
          );
        }
        valueToSend = parsedAmount;
      }

      const txData = {
        from,
        to: address,
        value: valueToSend,
      };

      const tx = await wallet.sendTransaction(txData);

      // Сохранение хэша транзакции
      await redis.set(`user:${ctx.from.id}:${from}:lastTxHash`, tx.hash);

      // Отправка сообщения с хэшем транзакции
      const sentMessage = await ctx.replyWithMarkdown(
        t(language, "transaction_sent", { hash: tx.hash })
      );

      // Асинхронное ожидание подтверждения транзакции
      waitForTransactionConfirmation(
        tx,
        ctx,
        sentMessage.message_id,
        address,
        valueToSend,
        language
      );

      await sendMainMenu(ctx);
    } catch (error) {
      await ctx.reply(
        t(language, "transaction_error", { error: error.message })
      );
    }
  });

  // Обработка нажатия на кнопку "Получить"
  bot.action("receive", async (ctx) => {
    try {
      const { language } = ctx.state.user;
      const encryptedKey = await redis.get(`user:${ctx.from.id}:privkey`);
      if (!encryptedKey) {
        return ctx.reply(t(language, "no_private_key"));
      }
      let privkey = decrypt(encryptedKey);

      const wallet = new quais.Wallet(privkey, provider);
      privkey = null;
      const address = await wallet.getAddress();

      await sendAndDeletePreviousMessage(
        ctx,
        t(language, "your_address", { address }),
        Markup.inlineKeyboard([
          Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
        ])
      );
    } catch (error) {
      await ctx.reply(t(language, "error", { error: error.message }));
    }
  });

  // Обработка нажатия на кнопку "Баланс"
  bot.action("balance", async (ctx) => {
    try {
      const { language } = ctx.state.user;
      const encryptedKey = await redis.get(`user:${ctx.from.id}:privkey`);
      if (!encryptedKey) {
        return ctx.reply(t(language, "no_private_key"));
      }
      let privkey = decrypt(encryptedKey);
      const wallet = new quais.Wallet(privkey, provider);
      privkey = null;
      const from = await wallet.getAddress();
      const balance = await provider.getBalance(from, "latest");

      await sendAndDeletePreviousMessage(
        ctx,
        t(language, "balance_amount", { balance: quais.formatQuai(balance) }),
        Markup.inlineKeyboard([
          Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
        ])
      );
    } catch (error) {
      await ctx.reply(t(language, "error", { error: error.message }));
    }
  });

  // Обработка нажатия на кнопку "Сохранить ключ"
  bot.action("savekey", async (ctx) => {
    const userId = ctx.from.id;
    const language = ctx.state.user.language || "en";

    const steps = { step: "save_key" };
    await updateUserState(userId, { steps });

    await sendAndDeletePreviousMessage(
      ctx,
      t(language, "enter_private_key"),
      Markup.inlineKeyboard([
        Markup.button.callback(t(language, "to_main_menu"), "main_menu"),
      ]),
      true
    );
  });

  // Обработка нажатия на кнопку "Главное меню"
  bot.action("main_menu", async (ctx) => {
    await sendMainMenu(ctx);
  });

  // Обработка нажатия на кнопку "Настройки"
  bot.action("settings", async (ctx) => {
    await promptLanguageSelection(ctx);
  });
}

// Функция для отправки главного меню
async function sendMainMenu(ctx, text = null) {
  const language = ctx.state.user.language || "en";
  const menuText = text || t(language, "choose_action");
  await sendAndDeletePreviousMessage(ctx, menuText, getMainMenu(language));
}

// Функция для получения клавиатуры главного меню
function getMainMenu(language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(language, "send"), "send")],
    [Markup.button.callback(t(language, "receive"), "receive")],
    [Markup.button.callback(t(language, "balance"), "balance")],
    [Markup.button.callback(t(language, "save_key"), "savekey")],
    [Markup.button.callback(t(language, "settings"), "settings")],
  ]);
}

// Функция для запроса выбора языка
async function promptLanguageSelection(ctx) {
  const language = ctx.state.user.language || "en";
  const languageKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback("English", "language_en")],
    [Markup.button.callback("Русский", "language_ru")],
    [Markup.button.callback("中文", "language_zh")],
    [Markup.button.callback(t(language, "back"), "main_menu")],
  ]);
  await sendAndDeletePreviousMessage(
    ctx,
    t(language, "select_language"),
    languageKeyboard
  );
}

// Функция для отправки сообщения и удаления предыдущего
async function sendAndDeletePreviousMessage(
  ctx,
  text,
  keyboard = null,
  edit = false
) {
  const userId = ctx.from.id;
  const { messageId } = ctx.state.user;

  try {
    // Удаление предыдущего сообщения
    if (messageId) {
      try {
        await ctx.deleteMessage(messageId);
      } catch (error) {
        console.error("Ошибка при удалении сообщения:", error.message);
      }
    }

    // Отправка или редактирование сообщения
    let newMessage;
    if (edit) {
      try {
        newMessage = await ctx.editMessageText(text, keyboard);
      } catch (error) {
        console.error("Ошибка при редактировании сообщения:", error.message);
        newMessage = await ctx.reply(text, keyboard);
      }
    } else {
      newMessage = await ctx.reply(text, keyboard);
    }

    // Сохранение ID нового сообщения
    if (newMessage && newMessage.message_id) {
      await updateUserState(userId, { messageId: newMessage.message_id });
    }
  } catch (error) {
    console.error("Ошибка в sendAndDeletePreviousMessage:", error.message);
  }
}

// Функция для проверки состояния транзакции
async function ensureTransactionProcessed(txHash, provider, language) {
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    throw new Error(t(language, "previous_transaction_pending"));
  }
  if (receipt.status === 0) {
    throw new Error(t(language, "previous_transaction_failed"));
  }
  return receipt;
}

// Функция для обновления состояния пользователя с сохранением языка
async function updateUserState(userId, newPartialState) {
  const userState = await loadUserState(userId);
  const updatedState = { ...userState, ...newPartialState };
  await saveUserState(userId, updatedState);
}

// Функция для асинхронного ожидания подтверждения транзакции
async function waitForTransactionConfirmation(
  tx,
  ctx,
  messageId,
  address,
  valueToSend,
  language
) {
  try {
    const txReceipt = await tx.wait();

    // Обновление сообщения после подтверждения
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      messageId,
      undefined,
      t(language, "transaction_confirmed", {
        amount: quais.formatQuai(valueToSend),
        address,
        hash: tx.hash,
      }),
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    if (error.message === "TimeoutError") {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        messageId,
        undefined,
        t(language, "transaction_timeout", { hash: tx.hash }),
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply(
        t(language, "transaction_error", { error: error.message })
      );
    }
  }
}
