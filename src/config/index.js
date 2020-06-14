// Load .env;
const chalk = require('chalk');
const dotenv = require('dotenv');

// Searches for .env in Current Working Directory by Default
// Make sure you read README.md, and rename .env.example to .env
// IF NOT FOUND, MANUALLY PUT YOUR .env PATH FROM CWD
const envFound = dotenv.config(/* {path: ".env"} */);

// Check if .env file exists and has been loaded
if (envFound.error) {
	console.log(chalk.bgRed.black('\'.env\' HAS NOT BEEN FOUND!'));
}

const requiredEnvVariables = [process.env.API_KEY, process.env.MONGO_URI];

requiredEnvVariables.forEach((envVar) => {
	if (typeof envVar === 'undefined') {
		throw new Error(chalk.bgRed.black('Required .env Variables have not been found.'));
	}
});

const config = {
	// AlphaVantage API Key
	API_KEY: process.env.API_KEY,

	// MongoDB URI
	MONGO_URI: process.env.MONGO_URI,

	// Database Name
	DB_NAME: process.env.DB_NAME || 'MixedSignals',

	// Testing Database Name
	TEST_DB_NAME: process.env.TEST_DB_NAME || 'UnitTesting',

	// .env is default, fall back to port 5000 if not specified
	PORT: process.env.PORT || 5000,

	// Logging level, will log everything if not specified
	LOGS: {
		level: process.env.LOGS || 'silly',
	},
};

module.exports = config;
