const env = require('./helpers/environment');
const connection = require('./classes/mysql');
const chatRegistry = require('./classes/chats');
const telegramBot = require('node-telegram-bot-api');

const telegram = new telegramBot(env.TOKEN, { polling: true });

telegram.on('message', (message) => {
  chatRegistry.register(message);
  
  if (message.media_group_id) {
    chatRegistry.handleAlbum(message, () => {
      telegram.sendMessage(message.chat.id, "Brei is Gay, thanks for the Album.");  
    });
    return;
  } else if (message.photo){
    telegram.sendMessage(message.chat.id, "Brei is Gay, thanks for the image.");
    return;
  } else if (message){
    telegram.sendMessage(message.chat.id, "Brei is Gay, I only accept images and albums of images");
    return;
  }
}); 

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message === "ETELEGRAM: 401 Unauthorized"){
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  }
});
