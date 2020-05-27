const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ~~~~~~~~~~ Mongoose Schemata ~~~~~~~~~~~~
// User Schemata
const NewsPreference_S = new Schema({
    type: String,
    subtype: [String]
});

const User_S = new Schema({
    name: String,
    password: String,
    preferences: [NewsPreference_S]
});

// Stocks/Crypto Schemata
const Quote_S = new Schema({
    day: { type: Date },
    price: { type: mongoose.Types.Decimal128 },
    volume: { type: mongoose.Types.Decimal128 }
})

const Stock_S = new Schema({
    name: String,
    type: String,
    LastUpdated: { type: Date, default: new Date() },
    prices: [Quote_S]
})

// Compile Schemas into usuable models
const User = mongoose.model("User", User_S);
const Stock = mongoose.model("Stock", Stock_S);

exports.User = User;
exports.Stock = Stock;