const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Stocks/Crypto Schemata
const Quote_S = new Schema({
    day: {
        type: Date,
        index: true
    },
    price: { type: mongoose.Types.Decimal128 },
    volume: { type: mongoose.Types.Decimal128 }
});

const Stock_S = new Schema({
    name: {
        type: String,
        required: [true, "You must give a name to the stock"],
        trim: true,
        uppercase: true,
        unique: true
    },

    // make into enum?
    type: {
        type: String,
        enum: ["Crypto", "Stock"]
    },
    prices: [Quote_S]
},
    // Adds createdAt and updatedAt fields into the record
    {
        timestamps: true
    }
);

// Compile into model
const Stock = mongoose.model("Stock", Stock_S);

exports.Stock = Stock;
