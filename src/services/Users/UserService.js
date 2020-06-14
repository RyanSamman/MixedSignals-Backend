const bcrypt = require('bcrypt');

const UserModel = require('../../models/UserModel');

// TODO: getUserData method

class UserService {
	async createUser({ email='', name='', password='' } = {}) {
		if (password.length < 6) return { 'status': 400, 'error': 'Invalid Password' };
		const passwordHash = await bcrypt.hash(password.trim(), 10);
		try {
			let NewUser = await UserModel.create({ email, name, passwordHash });
			return { 'status': 201, 'data': NewUser };
		} catch (err) {
			let error = err.name;
			// Duplicate E-Mail (or any other field)
			if (err.name === 'MongoError') error = 'E-Mail is already registered';
			// Required fields missing
			if (err.name === 'ValidationError') error = 'Fill in the required Fields';
			return { 'status': 400, 'error': error };
		}
	}

	async login({ email='', password='' } = {}) {
		let userData = await UserModel.findOne({ email });
		// TODO
		// if (!userData.verified) return { 'status': 403, 'error': 'Not Verified' };
		if (!userData) return { 'status': 404, 'error': 'User Not Found' };
		let isCorrectPassword = await bcrypt.compare(password.trim(), userData.passwordHash);
		if (isCorrectPassword) {
			return { 'status': 200, 'message': 'Successful Login', 'data': userData };
		}
		return { 'status': 401, 'error': 'Unsuccessful Login' };
	}

	/**
	 * Checks for record with the same E-Mail
	 * @param {string} email E-Mail to check if present
	 * @returns {boolean} True if Present; False if no match
	 */
	async isPresent(email='') {
		if (typeof(email) !== 'string') throw new Error('Email must be a string!');
		let dataPresent = await UserModel.findOne({ email }).select({ '_id': 1 });
		if (dataPresent) return true;
		return false;
	}

	async updateName({ email='', name='' } = {}) {
		if (!(email && (name.length >= 3) && !name.includes(' '))) return { 'status': 400 };
		let user = await UserModel.findOne({ email });
		if (!user) return { 'status': 404 };
		user.name = name;
		let updatedUser = await user.save();
		return { 'status': 200, 'data': updatedUser };
	}

	async deleteUser({ email='' } = {}) {
		let deletedUser = await UserModel.deleteOne({ email });
		if (deletedUser.deletedCount === 0) return { 'status': 404 };
		return { 'status': 204 };
	}

	// async recoverUser({ email }) {
	// 	// TODO - Create after E-Mail server & redis is setup
	// 	return { 'status': 501, 'message': { email } };
	// }

	async findAllUsers() {
		if (!(process.env.DEV || process.env.CI)) return { 'status': 401, 'message': 'Must be in a CI Environment!' };
		let users = await UserModel.find();
		return { 'status': 200, 'users': users };
	}

	async deleteAllUsers() {
		if (!(process.env.DEV || process.env.CI)) return { 'status': 401, 'message': 'Must be in a CI Environment!' };
		let deletedInfo = await UserModel.deleteMany();
		return { 'status': 200, 'deletedCount': deletedInfo.n };
	}
}

module.exports = UserService;

// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
// ~~~~~ How to design a good Login/Authentication system ~~~~
/**
 * Registration:
 *  Return generic response Ex. "A link to activate your account has been emailed to the address provided."
 *  Sanitize inputs, strip whitespace, possibly match Regex
 * 
 *	If no email matched in db:
 *		Send registration Email expiring in x-amount of time with generic message 

 *	If email is already registered, OWASP reccomends not exposing that it has been or not,
 *		However, most non-critical websites don't follow ^ to have a better UX

 *  Use bcrypt to generate salt & hash password
 *  Store user in database
 *  Flag whether or not the account has been authenticated yet via email
 * 
 * Login:
 * 	~ Via custom login ~
 *  Search for email in database
 *  If a match is found (TODO: This method will expose that no user is found via timing it takes)
 *  	Match password & stored salt with the hashed password with bcrypt with a constant time algorithm to prevent timing attacks on password
 *  If password hasn't matched, or no match found, raise Error; Login failed; Invalid E-mail or password
 * 	else, Authorize & send JWT/Session ID
 *  ~ OAuth ~
 *  //TODO: Research Google OAuth & Capchas
 *  Login -> Google Magic Box -> Database -> Authorize
 * 
 * 	(Advanced Steps:)
 * 		If a wrong password has been entered, 
 * 		exponentially increase time between logins for the account & Add Capcha
 * 		At some point, send an E-mail & Lock account?
 * 
 * 
 * Recovery:
 * 	Send generic message Ex. "If your E-mail address is valid, we will send you an email to reset your password."
 *  (Best not to say if user exists)
 *  	Contents with URL to update the password
 * 
 * Updating & Deleting a user (In Production):
 *  Check if authorized,
 *  best practice to:
 *  	Flag record as Outdated/Deleted (for debugging purposes)
 *  	If a new record is added/updated with the same unique ID (email most likely);
 * 			Create record with a version variable greater than the previous one
 * 
 */