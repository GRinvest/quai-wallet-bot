export const languages = ["en", "ru", "zh"];

const messages = {
  en: {
    welcome: "Welcome! Please choose an action:",
    choose_action: "Please choose an action:",
    send: "📤 Send",
    receive: "📥 Receive",
    balance: "💰 Balance",
    save_key: "🔑 Save key",
    main_menu: "🏠 Main Menu",
    enter_address: "Please enter the address to send to:",
    invalid_address: "Invalid address. Please try again.",
    enter_amount: 'Enter the amount to send (or "all" to send the full balance):',
    invalid_amount: 'Invalid amount. Please enter a positive number or "all". Try again.',
    confirm_send: "Confirm sending {amount} Quai to {address}.",
    confirm: "✅ Confirm",
    settings: "⚙️ Settings",
    back: "⬅️ Back",
    to_main_menu: "⬅️ To Main Menu",
    transaction_sent:
    "✈️ Transaction sent.\n\n🔗 Hash: [{hash}](https://quaiscan.io/tx/{hash})\n\n⏳ Waiting for confirmation...",
    transaction_confirmed:
    "🎉 You have successfully sent: {amount} QUAI to address {address}\n\n🔗 Hash: [{hash}](https://quaiscan.io/tx/{hash})\n\n✅ Transaction confirmed.",
    transaction_timeout:
      "⚠️ Confirmation timeout. Please check the transaction status manually:\n\n🔗 [Check Transaction](https://quaiscan.io/tx/{hash})",
    transaction_error: "Error sending transaction: {error}",
    previous_transaction_pending: "The previous transaction is still pending. Please wait until it is confirmed.",
    previous_transaction_failed: "The previous transaction failed.",
    no_private_key:
      "Your private key was not found. Please save it using the /savekey command.",
    private_key_saved: "Your key has been saved. Address: {address}",
    enter_private_key: "Please enter your Private Key:",
    balance_amount: "Your balance: {balance} QUAI",
    your_address: "Your address: {address}",
    insufficient_funds: "Insufficient funds to cover the gas fee.",
    insufficient_funds_amount:
      "Insufficient funds for the specified amount and gas fee.",
    previous_transaction_pending:
      "The previous transaction is still pending. Please wait until it is confirmed.",
    previous_transaction_failed: "The previous transaction failed.",
    error: "Error: {error}",
    language_selected: "Language selected: {language}",
    select_language: "Please select your language:",
    invalid_private_key: "Invalid private key. Please try again.",
  },
  ru: {
    welcome: "Добро пожаловать! Пожалуйста, выберите действие:",
    choose_action: "Пожалуйста, выберите действие:",
    send: "📤 Отправить",
    receive: "📥 Получить",
    balance: "💰 Баланс",
    save_key: "🔑 Сохранить ключ",
    main_menu: "🏠 Главное меню",
    enter_address: "Пожалуйста, введите адрес для отправки:",
    invalid_address: "Неверный адрес. Пожалуйста, попробуйте снова.",
    enter_amount: 'Введите сумму для отправки (или "all", чтобы отправить весь баланс):',
    invalid_amount: 'Недопустимая сумма. Введите положительное число или "all". Попробуйте снова.',
    confirm_send: "Подтвердите отправку {amount} Quai на адрес {address}.",
    confirm: "✅ Подтвердить",
    settings: "⚙️ Настройки",
    back: "⬅️ Назад",
    to_main_menu: "⬅️ В главное меню",
    transaction_sent:
      "✈️ Транзакция отправлена.\n\n🔗 Хэш: [{hash}](https://quaiscan.io/tx/{hash})\n\n⏳ Ожидание подтверждения...",
    transaction_confirmed:
      "🎉 Вы успешно отправили: {amount} QUAI на адрес {address}\n\n🔗 Хэш: [{hash}](https://quaiscan.io/tx/{hash})\n\n✅ Транзакция подтверждена.",
    transaction_timeout:
      "⚠️ Время ожидания подтверждения истекло. Пожалуйста, проверьте статус транзакции вручную:\n\n🔗 [Проверить транзакцию](https://quaiscan.io/tx/{hash})",
    transaction_error: "Ошибка при отправке транзакции: {error}",
    previous_transaction_pending: "Предыдущая транзакция все еще обрабатывается. Пожалуйста, дождитесь ее подтверждения.",
    previous_transaction_failed: "Предыдущая транзакция не удалась.",
    no_private_key:
      "Ваш приватный ключ не найден. Пожалуйста, сохраните его с помощью команды /savekey.",
    private_key_saved: "Ваш ключ сохранен. Адрес: {address}",
    enter_private_key: "Пожалуйста, введите ваш приватный ключ:",
    balance_amount: "Ваш баланс: {balance} QUAI",
    your_address: "Ваш адрес: {address}",
    insufficient_funds: "Недостаточно средств для покрытия комиссии за газ.",
    insufficient_funds_amount:
      "Недостаточно средств для указанной суммы и комиссии за газ.",
    previous_transaction_pending:
      "Предыдущая транзакция все еще находится в ожидании. Пожалуйста, дождитесь ее подтверждения.",
    previous_transaction_failed: "Предыдущая транзакция не удалась.",
    error: "Ошибка: {error}",
    language_selected: "Выбран язык: {language}",
    select_language: "Пожалуйста, выберите ваш язык:",
    invalid_private_key: "Недействительный приватный ключ. Пожалуйста, попробуйте снова.",
},

zh: {
    welcome: "欢迎！请选择一个操作：",
    choose_action: "请选择一个操作：",
    send: "📤 发送",
    receive: "📥 接收",
    balance: "💰 余额",
    save_key: "🔑 保存密钥",
    main_menu: "🏠 主菜单",
    enter_address: "请输入发送地址：",
    invalid_address: "地址无效。请重试。",
    enter_amount: '请输入发送金额（或输入 "all" 发送全部余额）：',
    invalid_amount: '金额无效。请输入正数或 "all"。请重试。',
    confirm_send: "确认发送 {amount} Quai 至 {address}。",
    confirm: "✅ 确认",
    settings: "⚙️ 设置",
    back: "⬅️ 返回",
    to_main_menu: "⬅️ 返回主菜单",
    transaction_sent:
      "✈️ 交易已发送。\n\n🔗 哈希：[{hash}](https://quaiscan.io/tx/{hash})\n\n⏳ 等待确认...",
    transaction_confirmed:
      "🎉 您已成功发送：{amount} QUAI 到地址 {address}\n\n🔗 哈希：[{hash}](https://quaiscan.io/tx/{hash})\n\n✅ 交易已确认。",
    transaction_timeout:
      "⚠️ 确认超时。请手动检查交易状态：\n\n🔗 [检查交易](https://quaiscan.io/tx/{hash})",
    transaction_error: "发送交易时出错：{error}",
    previous_transaction_pending: "上一笔交易仍在处理中。请等待确认。",
    previous_transaction_failed: "上一笔交易失败。",
    no_private_key:
      "未找到您的私钥。请使用 /savekey 命令保存它。",
    private_key_saved: "您的密钥已保存。地址：{address}",
    enter_private_key: "请输入您的私钥：",
    balance_amount: "您的余额：{balance} QUAI",
    your_address: "您的地址：{address}",
    insufficient_funds: "资金不足以支付燃气费。",
    insufficient_funds_amount:
      "资金不足以支付指定金额和燃气费。",
    previous_transaction_pending:
      "上一笔交易仍在处理中。请等待其确认。",
    previous_transaction_failed: "上一笔交易失败。",
    error: "错误：{error}",
    language_selected: "已选择语言：{language}",
    select_language: "请选择您的语言：",
    invalid_private_key: "无效的私钥。请重试。",
},

};

export function t(language, key, params = {}) {
    let msg = messages[language][key] || messages["en"][key] || key;
    for (const [param, value] of Object.entries(params)) {
      const regex = new RegExp(`{${param}}`, 'g'); // Global replacement
      msg = msg.replace(regex, value);
    }
    return msg;
  }
