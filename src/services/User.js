const UserModel = require('./../models/Users');
//const bcrypt = require('bcrypt');

const users = [
	{
		'username': 'RyanSamman',
		'password': 'abc123'
	},
	{
		'username': 'Test',
		'password': 'test123'
	}
];

class UserService {
	async login(username='', password='') {
		let x = users.find((currentValue) => {
			if (currentValue.username !== username) return false;
			if (currentValue.password !== password) return false;
			return true;
		});
		console.log(x);
		if (x !== []) return true; 
		return false;   
	}

	async createUser(username, password) {
		users.push({username, password});
		return {
			'status': '201', 
			'message': users
		};
	}

	async authenticate(username/*, password*/) {
		UserModel.findOne({username: username}, (err, /*data*/) =>{
			if (err) return err;
			//bcrypt.compare(password,)

		});
	}
	
	async deleteUser(username, password) {
		return {username, password};
	}

	async test(username='', password='') {
		const userRegex = new RegExp(/WIP/, );
		const passRegex = new RegExp(/WIP/, );

		return userRegex.test(username) && passRegex.test(password);
	}

}

module.exports = UserService;
