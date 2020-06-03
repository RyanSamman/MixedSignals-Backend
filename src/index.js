// Give strings color, to highlight errors etc https://www.npmjs.com/package/chalk
const chalk = require('chalk');

// Throws error if any occur uncaught inside a promise
process.on('unhandledRejection', (err) => {
	console.error(chalk.bgRed.black('⚠ Unhandled Rejection was not caught:\n', err));
	throw err;
});

async function main() {
	// Load Config file
	const config = require('./config');
	console.log(chalk.bgBlue.black('\n Config Files Loaded!: \n'), config, '\n');

	// Load Database
	const databaseLoader = require('./loaders/loadDatabase');
	let { timeToConnect } = await databaseLoader(config);
	console.log(chalk.bgBlue.black(` Time to connect to Database: ${timeToConnect} Seconds \n`));

	// Load Express routes
	const app = require('./loaders/express');

	// 404 - Not Found -  route; Must be last route
	app.use(require('./services/404'));

	// Bind config port to Express
	app.listen(config.PORT, () => {
		console.log(chalk.bgBlue.black(` Server started on port ${config.PORT} \n`));
	});
}

main();
