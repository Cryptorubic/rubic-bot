## Rubic bots

### Requirement
node version > 15.4.0

yarn version > 1.22.10

### How to run
1. Before run add `.env` file with following format

```
BRIDGE_BOT_TOKEN=<telegram-bot-token>
BRIDGE_CHAT_ID=<telegram-chat-id>
INSTANT_TRADE_BOT_TOKEN=<telegram-bot-token>
INSTANT_TRADE_CHAT_ID=<telegram-chat-id>
```

2. Run `yarn` to install dependencies

3. Run `yarn run start` to start server locally

4. Run `pm2 start npm -- run start-prod` to run pm2 daemon

5. To stop daemon run `pm2 stop all`

