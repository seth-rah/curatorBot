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

  if (message.media_group_id) {
    chatRegistry.handleAlbum(message, () => {
      telegram.sendMessage(message.chat.id, "Brei is Gay, Albums are unsupported at this time, please condense your post into a single image, we will not accept posts that span context across multiple different images, text on images will also be ignored.");  
    });
    return;
  } 
  
  if (message.photo) {
    connection.query(imagesSQL, [imagesTG], (err, result) => {
      if (err) {
        if (err.errno === 1062){
          telegram.sendMessage(message.chat.id, "Brei is Gay, We've identified that this image has matching properties to another image we've already been sent, this image will be ignored.");
          console.log("duplicate image received")
          return;
        }
        console.log("Error Number: " && err.errno)
        throw err;
      }
      telegram.sendMessage(message.chat.id, "Brei is Gay, thanks for the image.");
      console.log("DB entry created for images")
    })
    return;
  } 
  
  if (message) {
    telegram.sendMessage(message.chat.id, "Brei is Gay, We only accept messages in an image format, albums and text on messages will be ignored");
    return;
  }

});

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message === "ETELEGRAM: 401 Unauthorized"){
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  } 
});