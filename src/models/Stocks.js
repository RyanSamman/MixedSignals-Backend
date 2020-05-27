const mongoose = require('mongoose');

const { Schema } = mongoose;

// Stocks/Crypto Schemata
const schemaQuote = new Schema({
  day: {
    type: Date,
    index: true,
  },
  price: { type: mongoose.Types.Decimal128 },
  volume: { type: mongoose.Types.Decimal128 },
});

const schemaStock = new Schema({
  name: {
    type: String,
    required: [true, 'You must give a name to the stock'],
    trim: true,
    uppercase: true,
    unique: true,
  },

  // make into enum?
  type: {
    type: String,
    enum: ['Crypto', 'Stock'],
  },
  prices: [schemaQuote],
},
// Adds createdAt and updatedAt fields into the record
{
  timestamps: true,
});

// Compile into model
const Stock = mongoose.model('Stock', schemaStock);

exports.Stock = Stock;
