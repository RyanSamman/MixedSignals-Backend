const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const chalk = require('chalk');

// Health Check API
// https://www.ibm.com/garage/method/practices/manage/health-check-apis/
// Standard is to return the current status and (optional) JSON body
// TODO: move to promise checking status of database?
app.get("/status", (req, res) => res.status(200).json({ "status": "200" }));
app.head("/status", (req, res) => res.status(200).end());

/* ~~~~~~~~~~~~~~~~~~~~ Express Middleware ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Used to parse encoded json inside body
app.use(bodyParser.json());

// Parses x-www-form-urlencoded data (Requests from forms) from body
// change extended to true if handling more than strings and arrays
// Less overhead when set to false, as using simpler algorithm to parse
app.use(bodyParser.urlencoded({ extended: false }));

// Used to parse cookies
app.use(cookieParser());

// TODO: Create Logger to log all requests instead of printing to console
app.use((req, res, next) => {
    console.log(chalk.bgBlue.black(`Method: ${req.method}; Path: ${req.path}; IP: ${req.ip}`));
    next();
});

// ⚠ SERVER WILL ONLY HANDLE BACKEND APIs, the Webpack Dev Server Handles Frontend ⚠
/*
// serve static files (for CSS, pictures, etc)
app.use(express.static(path.join(__dirname, 'public')));
*/

/* ~~~~~~~~~~~~~~~~~~~~~ Express Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// User routes
app.use("/api/users", require("../api/users"));

// Stocks routes
app.use("/api/stocks", require("../api/stocks"));

// 404 NOT FOUND ROUTE, MUST BE LAST
app.use((req, res, next) => {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});
module.exports = app;
