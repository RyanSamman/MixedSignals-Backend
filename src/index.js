// Give strings color, to highlight errors etc https://www.npmjs.com/package/chalk
const chalk = require('chalk');

// Config file
const config = require("./config");
console.log("Config Files Loaded!:\n", config);

// Throws error if any occur uncaught inside a promise
process.on('unhandledRejection', err => {
    console.error(chalk.bgRed.black("⚠ Unhandled Rejection was not caught:\n", err));
    throw err;
});

// Load Express routes
const app = require("./loaders/express");

let dbconnection = require("./loaders/db");

// Bind config port to Express
app.listen(config.PORT, () => console.log(`Server started on port ${config.PORT}`));
