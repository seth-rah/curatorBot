const env = require('../helpers/environment');
const mysql = require('mysql');

let connection;

// Creates a MySQL connection instance.
function createInstance() {
  console.log('MySQL Connecting...');
  
  const config = {
    host:     env.MYSQL_HOST,
    port:     env.MYSQL_PORT,
    database: env.MYSQL_DATABASE,
    user:     env.MYSQL_USER
  };
  
  if (env.MYSQL_PASSWORD) {
    config.password = env.MYSQL_PASSWORD;
  }
  
  connection = mysql.createConnection(config);
  
  // Try to connect and retry when unsuccessful.
  connection.connect((error) => {
    if (error) {
      console.log(`${error}! Retrying...`);
      setTimeout(() => createInstance(), 3000);
    } else {
      console.log('Connected to MySQL.')
    }
  });
  
  // When the connection was lost, we retry the connection.
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log(error);
      createInstance();
    } else {
      throw error;
    }
  });
}

// Make the initial connection.
createInstance();

module.exports = connection;