const env = require('./helpers/environment');
const connection = require('./classes/mysql');
const chatRegistry = require('./classes/chats');
const telegramBot = require('node-telegram-bot-api');

const telegram = new telegramBot(env.TOKEN, { polling: true });

telegram.on('message', (message) => {
  chatRegistry.register(message);
  const imagesSQL = "INSERT INTO images (chatID, messageID, userID, userName, userFirstName, userLastName, fileID, status) VALUES ?";

  const chatID = message.chat.id;
  const messageID = message.message_id;
  const userID = message.from.id;
  const userName = message.from.username;
  const userFirstName = message.from.first_name;
  const userLastName = message.from.last_name;
  const fileID = message.photo[0].file_id;

  const imagesTG = [
    [chatID,
    messageID,
    userID,
    userName,
    userFirstName,
    userLastName,
    fileID,
    'PENDING']
  ];

  console.log(imagesTG);
  
  if (message.media_group_id) {
    chatRegistry.handleAlbum(message, () => {
      telegram.sendMessage(message.chat.id, "Brei is Gay, Albums are unsupported at this time, please condense your post into a single image, we will not accept posts that span context across multiple different images, the text on your image will also be ignored.");  
    });
    return;
  } 
  
  if (message.photo) {
    connection.query(imagesSQL, imagesTG, function (err, result){
      if (err === 'ER_DUP_ENTRY'){
        telegram.sendMessage(message.chat.id, "We've already received this image");
        return;
      }

      telegram.sendMessage(message.chat.id, "Brei is Gay, thanks for the image.");
      if (message.text) {
        telegram.sendMessage(message.chat.id, "The additional text on your image will be ignored");
      }
      
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