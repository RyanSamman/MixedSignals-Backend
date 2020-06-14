const mongoose = require('mongoose');

const { Schema } = mongoose;

// Stocks/Crypto Schemata
const schemaQuote = new Schema({
	date: {
		type: Date,
	},
	open: { type: mongoose.Types.Decimal128 },
	high: { type: mongoose.Types.Decimal128 },
	low: { type: mongoose.Types.Decimal128 },
	close: { type: mongoose.Types.Decimal128 },
	volume: { type: Number },
});

const schemaStock = new Schema({
	name: {
		type: String,
		required: [true, 'You must give a name to the stock'],
		trim: true,
		uppercase: true,
		unique: true,
	},
	latest: Date,
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

module.exports = Stock;
