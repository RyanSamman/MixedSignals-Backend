const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

class UserService {
	async createUser({email='', name='', password=''} = {}) {
		if (password.length < 6) return {'status': 400, 'message': 'Invalid Password'};
		const passwordHash = await bcrypt.hash(password.trim(), 10);

		try {
			let NewUser = await UserModel.create({email, name, passwordHash});
			return {'status': 201, 'data': NewUser};

		} catch (err) {
			console.log(`Error '${err.name}' while Creating User:\n`, err);
			if (err.name === 'MongoError') {
				return {'status': 400, 'Error': 'E-Mail is already registered'};
			} else if (err.name === 'ValidationError') {
				return {'status': 400, 'Error': 'Fill in the required Fields'};
			} else {
				console.log('WARNING: UNKNOWN ERROR');
				return {'status': 500, 'Error': 'Unknown Error'};
			}
		}
	}

	async login({email='', password=''} = {}) {
		let userData = await UserModel.findOne({email: email});
		if (!userData) return {'status': 404, 'message': 'User Not Found'};
		let isCorrectPassword = await bcrypt.compare(password.trim(), userData.passwordHash);

		if (isCorrectPassword) {
			return {'status': 200, 'message': 'Successful Login', userData};
		}
		return {'status': 401, 'message': 'Unsuccessful Login'};
	}

	/**
	 * Checks for record with the same E-Mail
	 * @param {string} email E-Mail to check if present
	 * @returns {boolean} True if Present; False if no match
	 */
	async isPresent(email) {
		let dataPresent = await UserModel.findOne({email});
		if (dataPresent) return true;
		return false;
	}

	async updateName({email='', name=''} = {}) {
		let user = await UserModel.findOne({email});
		console.log(user);
		if (!user) return {'status': 404, 'message': 'User Not Found'};

		// TODO: Test for ideal username
		user.name = name;
		let updatedUser = await user.save();
		return {'status': 200, updatedUser};
	}

	async deleteUser({email=''} = {}) {
		// Will Require Authorization
		let deletedUser = await UserModel.deleteOne({email});
		if (deletedUser.deletedCount === 0) return {'status': 404, 'message': 'User Not Found'};

		// TODO: Remove response, send 204
		return {'status': 200, 'deleteInfo': deletedUser };
	}

	async recoverUser({email}) {
		// WIP
		return {'status': 501, 'message': {email}};
	}

	async queryUsers({email, name, preferences})  {
		let response = await UserModel.find({email, name, preferences}, (err, users) =>{
			if (err) return {'status': 501, err};
			return {'status': 200, 'data': users};
		});
		return response;
	}

	async findAllUsers() {
		// TODO: Check if in Dev/CI Environment; Or Authorized/Admin User:
		// if (process.env.DEV || process.env.CI) return {'status': 401};
		let response = await UserModel.find({}, (err, userList) => {
			if (err) return {'status': 500, err};
			return {'status': 200, 'message': userList};
		});
		console.log(response);
		return response;
	}

	async deleteAllUsers() {
		// TODO: Authrization/Dev&CI env
		let response = await UserModel.deleteMany({}, (err, usersDeleted) => {
			if (err) return {'status': 500, err};
			return { 'status': 200, usersDeleted };
		});

		console.log(response);

		return response;
	}
}

module.exports = UserService;

async function main() {
	const User = new UserService();
	let obj = {};

	//obj = await UserModel.deleteOne({'email': 'foo@hotmail.com'});
	//console.log(obj);

	//obj = await User.updateName({'email': 'foo@hotmail.com', 'name': 'FooBar'});
	//console.log(obj);

	//obj = await User.createUser({email: 'RyanSamman@outlook.com', password: 'Abc123'});
	//console.log(obj);

	//obj = await User.isPresent('RyanSamman@outlook.com');
	//console.log(obj);

	//obj = await User.login({email: 'RyanSamman@outlook.com', password: 'Abc123'});
	//console.log(obj);

	//obj = await User.findAllUsers();
	//console.log('All Users:\n', obj);

	//await User.deleteAllUsers();
}

main();

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