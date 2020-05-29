const telegramBot = require('node-telegram-bot-api');
const env = require('./helpers/environment');
const connection = require('./classes/mysql');
const chatRegistry = require('./classes/chats');
const telegram = new telegramBot(env.TOKEN, { polling: true });

var fileOptions = JSON.stringify(

  {
    "reply_markup": {
      "inline_keyboard": [
        [{
          "text": "A",
          "url": "https://google.com/"
        },
        {
          "text": "B",
          "url": "https://google.com/"
        }
        ],
        [{
          "text": "C",
          "url": "https://google.com/"
        },
        {
          "text": "Eating sock",
          "callback_data": "Socks hold nutritional value for growing kids"
        }]
      ]
    }
  }
)

telegram.on('message', (message) => {
  chatRegistry.register(message);

  if (message.media_group_id) {
    chatRegistry.handleAlbum(message, () => {
      telegram.sendMessage(message.chat.id, "Albums are unsupported at this time, please condense your post into a single image, we will not accept posts that span context across multiple different images, text on images will also be ignored.");
    });
    return;
  }

  if (message.photo) {
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

    connection.query(imagesSQL, [imagesTG], (err, result) => {
      if (err) {
        if (err.errno === 1062) {
          telegram.sendMessage(message.chat.id, "We've identified that this image has matching properties to another image we've already been sent, this image will be ignored.");
          console.log("duplicate image received")
          return;
        }
        console.log("Error Number: " && err.errno)
        throw err;
      }
      telegram.sendMessage(message.chat.id, "Thanks for the image.");
      telegram.sendPhoto(message.chat.id, "AgACAgQAAxkBAAIBtF7QFHt1NiW_gEBVWtb43My5wxLTAAKttDEbLu6AUmUYBdFKEHeLozLLIl0AAwEAAwIAA20AA7-KAgABGQQ", JSON.parse(fileOptions))
      console.log("DB entry created for images")
    })
    return;
  }

  if (message) {
    telegram.sendMessage(message.chat.id, "We only accept messages in an image format, albums and text on messages will be ignored");
    return;
  }

});

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message === "ETELEGRAM: 401 Unauthorized") {
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  }
});


telegram.on('callback_query', (uid, chatID) => {
  id = uid;
  console.log(uid.id)
  chatID = id.from.id;
  messageID = id.message.message_id
  const updateSQL = "UPDATE curator.images SET curator.images.status = 'REJECTED' WHERE chatID = " + chatID + " AND messageID = " + messageID;
  connection.query(updateSQL, (err, result) => {
    if (err) {
      if (err.errno === 1062) {
        telegram.sendMessage(id.from.id, "We've identified that this image has matching properties to another image we've already been sent, this image will be ignored.");
        console.log("duplicate image received")
        return;
      }
      console.log("Error Number: " && err.errno)
      throw err;
    }
    var callbackResponse =
    {
      "text": "You really want to eat that sock, don't you ( ͡° ͜ʖ ͡°)",
      "show_alert": false
    }
    telegram.answerCallbackQuery(uid.id, callbackResponse)
  })
});