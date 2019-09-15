const env = require('./helpers/environment');
const connection = require('./classes/mysql');

const debounce = require('debounce');
const telegramBot = require('node-telegram-bot-api');

const telegram = new telegramBot(env.TOKEN, { polling: true });

telegram.on('message', (message) => {
  if (!message.photo && !message.media_group_id){
    telegram.sendMessage(message.chat.id, "Brei is Gay, also I only accept posts with images or albums.");
  } else if (message.photo && !message.media_group_id) {
    telegram.sendMessage(message.chat.id, "Brei is Gay, also thanks for the image.");
  }
});

//debounce(fn, wait, [ immediate || false ])
debounce(telegram.on('message', (message) => {
  if (!message.photo && message.media_group_id){
    telegram.sendMessage(message.chat.id, "Brei is Gay, also I only accept posts with images or albums.");
  } else if (message.photo && message.media_group_id) {
    telegram.sendMessage(message.chat.id, "Brei is Gay, also thanks for the image.");
  }
}), 3000);

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message === "ETELEGRAM: 401 Unauthorized"){
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  }
});
