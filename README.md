# Quai Wallet Telegram Bot

A Telegram bot for managing Quai wallet transactions with localization support. The bot allows users to send and receive QUAI cryptocurrency, check their balance, and manage their wallet keys, all through a conversational interface in their preferred language.

## Features

- **Send and Receive QUAI**: Easily send and receive QUAI tokens directly within Telegram.
- **Balance Inquiry**: Check your wallet balance at any time.
- **Private Key Management**: Securely save your private key with encryption.
- **Localization**: Supports English, Russian, and Chinese languages.
- **Settings Menu**: Change language preferences through a settings menu.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/GRinvest/quai-wallet-bot.git
cd quai-wallet-bot
```

2. **Install dependencies:**

```bash
npm install
```

3. **Install and run Redis:**

The bot uses Redis to store user state. You need to install Redis on your server.

Ubuntu:

```bash
sudo apt update
sudo apt install redis-server
```

CentOS:

```bash
sudo yum install redis
```
MacOS (через Homebrew):

```bash
brew install redis
```
Запуск Redis:

Once installed, run Redis:

```bash
redis-server
```

Make sure Redis is running on the default port 6379.

## Configuration
Create a .env file in the root directory of the project and add the following environment variables:
```env
BOT_TOKEN=your_telegram_bot_token
RPC_URL=your_quai_network_rpc_url
ENCRYPTION_KEY=your_32_byte_hex_encryption_key
IV=your_16_byte_hex_initialization_vector
WEBHOOK_URL=your_webhook_url (required if running in production)
PORT=your_port_number (optional, defaults to 3000)
```
- BOT_TOKEN: Your Telegram bot token obtained from BotFather.
- RPC_URL: The RPC URL for connecting to the Quai network.
- ENCRYPTION_KEY: A 32-byte hex string used for AES-256-CBC encryption.
- IV: A 16-byte hex string used as the initialization vector for encryption.
- WEBHOOK_URL: The public URL of your server (required in production).
- PORT: The port your server will listen on (optional)

## Generating Encryption Key and IV:

```bash
node generate_keys.js
```
## Running the Bot

**Development Mode**

To run the bot in development mode with automatic restarts using nodemon:

```bash
npm run dev
```
**Production Mode**

Set the NODE_ENV environment variable to production and start the bot:
```bash
export NODE_ENV=production
npm start
```
Ensure that you have set the WEBHOOK_URL in your .env file when running in production.

## Dependencies

- telegraf: Telegram Bot API framework.
- ioredis: Redis client for Node.js.
- dotenv: Loads environment variables from a .env file.
- express: Web framework for handling webhooks.
- quais: Quai network library for blockchain interactions.
- crypto: Node.js built-in module for cryptography.
- nodemon: Development utility that monitors for changes and restarts your app.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
