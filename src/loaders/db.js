const chalk = require("chalk");

// Load config with MongoDB URI
const config = require("../config");

// MongoDB ODM
const mongoose = require('mongoose');

// Loading Database & Recording time taken to load
console.time("Time taken to load the database:");
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((err) => {
        console.error(err.reason);
        throw err;
    });

let db = mongoose.connection;

// Listening for errors after connection has been established
db.on('error', console.error.bind(console, err => `connection error:, ${err.reason}`));

db.once('open', function () {
    // TODO: Add to logger & port timer to logger
    console.log("Connected to database");
    console.timeEnd("Time taken to load the database:");
    module.exports = db;
});
