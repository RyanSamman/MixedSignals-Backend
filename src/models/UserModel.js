const mongoose = require('mongoose');

const { Schema } = mongoose;

const schemaNewsPreference = new Schema({
	type: String,
	subtypes: [String],
});

const schemaUser = new Schema({
	email: {
		type: String,
		required: [true, 'Email is Required (Testing error required?)'],
		trim: true,
		lowercase: true,
		// Creates Unique Index
		unique: true,
	},
	name: {
		type: String,
		/*required: [true, 'Testing name'],*/
		trim: true,
	},
	passwordHash: {
		type: String,
		required: [true, 'Password is required']
	},
	preferences: [schemaNewsPreference],
	verified: {
		type: Boolean,
		default: false,
	}
}, 
{
	timestamps: true,
});

// Compile Schema --> Mongoose Model
// Model of collection "Users"
// Mongoose tries to be "intellegent" by converting it into the lowercase & plural form...
// It can be overridden by doing either:
// 1 - mongoose.pluralize(null);
// 2 - pass in the collection name manually
const User = mongoose.model('User', schemaUser /* , collectionName */);

// Export Model
module.exports = User;
