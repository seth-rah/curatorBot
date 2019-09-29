const env = require('./helpers/environment');
const connection = require('./classes/mysql');
const chatRegistry = require('./classes/chats');
const telegramBot = require('node-telegram-bot-api');

const telegram = new telegramBot(env.TOKEN, { polling: true });

telegram.on('message', (message) => {
  chatRegistry.register(message);
  const imagesSQL = "INSERT INTO images (chatID, messageID, userID, userName, userFirstName, userLastName, fileID, status) VALUES ?"
  const imagesTG = [
    telegram.message.chat.id,
    telegram.message.id,
    telegram.message.user.id,
    telegram.message.user.username,
    telegram.message.user.first_name,
    telegram.message.user.last_name,
    telegram.message.photo.file_id,
    'PENDING'
  ]
  
  if (message.media_group_id) {
    chatRegistry.handleAlbum(message, () => {
      telegram.sendMessage(message.chat.id, "Brei is Gay, Albums are unsupported at this time, please condense your post into a single image, we will not accept posts that span context across multiple different images, the text on your image will also be ignored.");  
    });
    return;
  } 
  
  if (message.photo) {
    telegram.sendMessage(message.chat.id, "Brei is Gay, thanks for the image.");
    if (message.text) {
      telegram.sendMessage(message.chat.id, "The additional text on your image will be ignored");
    }
    connection.query(imagesSQL, imagesTG, function (err, result){
      if (err) throw err;
      console.log("DB entry created for images")
    })
    return;
  } 
  
  if (message) {
    telegram.sendMessage(message.chat.id, "Brei is Gay, I only accept messages in an image format, your text on the message will also be ignored");
    return;
  }


});

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message === "ETELEGRAM: 401 Unauthorized"){
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  } 
});

`id` bigint(64) unsigned NOT NULL AUTO_INCREMENT,
`chatID` bigint(64) NOT NULL,
`mediaGroupID` bigint(64) DEFAULT NULL,
`messageID` bigint(64) NOT NULL,
`userID` bigint(64) NOT NULL,
`userName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`userFirstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
`userLastName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
`fileID` bigint(64) NOT NULL,
`status` enum('PENDING','REJECTED','APPROVED','POSTED') COLLATE utf8mb4_unicode_ci NOT NULL,
`timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
`imagescol` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,