// Load .env; 
const chalk = require('chalk');
const dotenv = require('dotenv');

// Searches for .env in Current Working Directory by Default
// Make sure you read README.md, and rename .env.example to .env
// IF NOT FOUND, MANUALLY PUT YOUR .env PATH FROM CWD
const envFound = dotenv.config(/*{path: ".env"}*/);

// Check if .env file exists and has been loaded
if (envFound.error) {
    throw new Error(chalk.bgRed.black(
        "'.env' HAS NOT BEEN FOUND!"
    ))
}

let notFound = false;

// Check if MongoURI and API key exist
if (!process.env.API_KEY) {
    notFound = true;
    console.log(chalk.bgRed.black(
        "ALPHAVANTAGE API_KEY HAS NOT BEEN FOUND IN .env"
    ));
}

if (!process.env.MONGO_URI) {
    notFound = true;
    console.log(chalk.bgRed.black(
        "MONGO_URI HAS NOT BEEN FOUND IN .env"
    ));
}

if (notFound) {
    throw new Error(chalk.bgRed.black(
        "Required .env Variables have not been found."
    ));
}

// : process.env.VARIABLE || 

const config = {
    // AlphaVantage API Key
    API_KEY: process.env.API_KEY,

    // MongoDB URI
    MONGO_URI: process.env.MONGO_URI,

    // .env is default, fall back to port 5000 if not specified
    PORT: process.env.PORT || 5000,

    // Logging level, will log everything if not specified
    LOGS: {
        level: process.env.PORT || "silly"
    }
}

module.exports = config;