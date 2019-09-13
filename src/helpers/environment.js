// Required environment variables.
const required = [
  'TOKEN',
  'MYSQL_HOST',
  'MYSQL_PORT',
  'MYSQL_DATABASE',
  'MYSQL_USER',
  'MYSQL_PASSWORD'
];

// Optional environment variables.
const optional = {
  MYSQL_PASSWORD: null
};

const missing = [];
const env = {};

// Loop through all of our keys.
required.forEach((key) => {
  // Note any missing environment variables.
  if (typeof process.env[key] === 'undefined') {
    missing.push(key);
  }
  
  // Append the environment variable to our object. 
  env[key] = process.env[key];
});

// If there were missing keys we show and exit.
if (missing.length > 0) {
  console.log(`Your environment is missing ${missing.join(', ')}.`);
  process.exit(100);
}

// Assign all the optional variables.
Object.keys(optional).forEach((key) => {
  env[key] = (process.env[key] || optional[key]);
});

// Return our environment keys.
module.exports = env;