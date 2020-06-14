const mongoose = require('mongoose');

const { Schema } = mongoose;

const schemaPreference = new Schema({
	type: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	subtypes: [String]
});

const Preference = mongoose.model('Preference', schemaPreference /* , collectionName */);

// Export Model
module.exports = Preference;
