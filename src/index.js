const env = require('./helpers/environment');
const connection = require('./classes/mysql');

const telegramBot = require('node-telegram-bot-api');
const telegram = new telegramBot(env.TOKEN, { polling: true });

telegram.on("text", (message) => {
  telegram.sendMessage(message.chat.id, "Brei is Gay");
});

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message === "ETELEGRAM: 401 Unauthorized"){
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  }
});
