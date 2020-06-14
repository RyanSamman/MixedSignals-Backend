const chalk = require('chalk');
const mongoose = require('mongoose');

async function loadDatabase({ MONGO_URI, DB_NAME }) {
	let initialTime = new Date();
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			dbName: DB_NAME,
		});
	} catch (err) {
		// Log any errors which may occur during connection
		console.log(err);
		throw err;
	}
	const connection = mongoose.connection;

	// Listening for errors after connection has been established
	connection.on('error', (err) => {
		console.log(chalk.bgRed.black(`connection error:, ${err.reason}`));
	});

	mongoose.connection.on('disconnected', () => {
		console.log(chalk.bgRed.black('Mongoose default connection is disconnected'));
	});

	mongoose.connection.on('SIGINT', () => {mongoose.connection.close(() => {
		console.log('Connection Closed, disconnecting database');
		process.exit(0);
	});});

	// Do a task once connection has opened
	//connection.once('open', () => {})
	let timeToConnect = (new Date() - initialTime)/1000;
	return { timeToConnect, connection };
}

module.exports = loadDatabase;