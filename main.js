import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import express from "express";
import { quais } from "quais";
import { setupBotHandlers } from "./botHandlers.js";

dotenv.config();

if (!process.env.BOT_TOKEN || !process.env.RPC_URL) {
  throw new Error("BOT_TOKEN and RPC_URL must be set in the .env file");
}

const bot = new Telegraf(process.env.BOT_TOKEN);
const provider = new quais.JsonRpcProvider(process.env.RPC_URL);

// Setup bot handlers
setupBotHandlers(bot, provider);

// Start bot
async function startBot() {
  if (process.env.NODE_ENV === "production") {
    const webhookUrl = process.env.WEBHOOK_URL;
    const port = process.env.PORT || 3000;

    if (!webhookUrl) {
      throw new Error("WEBHOOK_URL must be set in .env for production");
    }

    await bot.telegram.setWebhook(`${webhookUrl}/bot${process.env.BOT_TOKEN}`);

    const app = express();
    app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

    app.get("/", (req, res) => {
      res.send("Bot is running via Webhook.");
    });

    app.listen(port, () => {
      console.log(`Bot is running on port ${port} via Webhook: ${webhookUrl}`);
    });
  } else {
    bot.launch();
    console.log("Bot is running via long polling.");
  }
}

startBot().catch((error) => {
  console.error("Error starting bot:", error.message);
});
