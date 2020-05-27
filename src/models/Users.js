const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User (_S)chemata

// Nested in User_S to be able to change more easily
// TODO: Refine NewsPreferences schema
const NewsPreference_S = new Schema({
    type: String,
    subtype: [String]
});

const User_S = new Schema({
    name: {
        type: String,
        required: [true, "Testing"],
        index: true
    },
    // TODO: Find best cryptographic hash for passwords (MD5)
    password: String,
    // TODO: Find a way to autogen salt
    // Appending the salt to the password before hashing ensures that it can't be
    // looked up on a rainbow table, so even if the database was breached, hackers cannot
    // decrypt the password
    // https://en.wikipedia.org/wiki/Rainbow_table
    salt: String,
    preferences: [NewsPreference_S]
});

// Compile Schema --> Mongoose Model
// Model of collection "Users"
// Mongoose tries to be "intellegent" by converting it into the plural form...
// It can be overridden by doing either:
// 1 - mongoose.pluralize(null);
// 2 - pass in the collection name manually
const User = mongoose.model("User", User_S /*, collectionName */);

// Export Model
exports.User = User;
