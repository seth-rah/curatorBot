const token = process.env.TOKEN;
const dbhost = process.env.MYSQL_HOST;
const dbport = process.env.MYSQL_PORT;
const dbschema = process.env.MYSQL_DATABASE;
const dbuser = process.env.MYSQL_USER;
const dbpassword = process.env.MYSQL_PASSWORD;

if (!token){
  console.log("token empty, please set token in curatorbot environment variables");
  process.exit(1);
};

if (!dbhost || !dbport || !dbschema || !dbuser || !dbpassword){
  console.log("Database envirornment variables not properly configured");
  console.log("Ensure that you set MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD in your curatorbot environment variables");
  process.exit(1);
};

const mysql = require('mysql');
const dbcredentials = {
  host: dbhost,
  port: dbport,
  database: dbschema,
  user: dbuser,
  password: dbpassword
};

let connection;
function handleDisconnect() {
  connection = mysql.createConnection(dbcredentials);
  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log(`DB connection to ${dbschema} on ${dbhost}:${dbport} successful`);
    }
  });
    
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

const telegramBot = require('node-telegram-bot-api');
const telegram = new telegramBot(token, { polling: true });

telegram.on("text", (message) => {
  telegram.sendMessage(message.chat.id, "Brei is Gay");
});

telegram.on('polling_error', (error) => {
  console.log(error.message);
  if (error.message == "ETELEGRAM: 401 Unauthorized"){
    console.log("Please ensure that your token from t.me/botfather is set up correctly in the 'TOKEN' environment variable");
  };
});
