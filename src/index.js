// Give strings color, to highlight errors etc https://www.npmjs.com/package/chalk
const chalk = require('chalk');

// Config file
const config = require('./config');

console.log('Config Files Loaded!:\n', config);

// Throws error if any occur uncaught inside a promise
process.on('unhandledRejection', (err) => {
  console.error(chalk.bgRed.black('⚠ Unhandled Rejection was not caught:\n', err));
  throw err;
});

// Load Database
const dbconnection = require('./loaders/db');

console.log(dbconnection);

// Load Express routes
const app = require('./loaders/express');

// 404 - Not Found route; Must be last route
app.use(require('./services/404'));

// Bind config port to Express
app.listen(config.PORT, () => console.log(`Server started on port ${config.PORT}`));
