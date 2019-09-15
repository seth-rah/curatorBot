const env = require('./helpers/environment');
const connection = require('./classes/mysql');

const telegramBot = require('node-telegram-bot-api');
const telegram = new telegramBot(env.TOKEN, { polling: true });

telegram.on('message', (message) => {
  message = Array.isArray(message) ? message : [message]
  if (!message.photo){
    telegram.sendMessage(message.chat.id, "Brei is Gay, also I only accept posts with images or albums.");
  } else if (message.photo.length > 1) {
    telegram.sendMessage(message.chat.id, "Brei is Gay, also thanks for the album.");
  } else {
    telegram.sendMessage(message.chat.id, "Brei is Gay, also thanks for the image.");
  }
});

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message === "ETELEGRAM: 401 Unauthorized"){
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  }
});
