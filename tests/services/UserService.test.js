/* eslint-disable no-undef */
const UserService = require('./../../src/services/UserService');
const mongoose = require('mongoose');
const config = require('./../../src/config');

const User = new UserService();


beforeAll(async () => {
	let {MONGO_URI, TEST_DB_NAME:DB_NAME} = config;
	await mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		dbName: DB_NAME,
	});
	await User.deleteAllUsers()
}, 20000);


// ~~~~~~~~~~~~~ User.createUser ~~~~~~~~~~~~~~~~~~~~
test('Registers a New User', async () => {
	let testUser = {
		'email': 'foo@hotmail.com',
		'password': 'bar123'
	} 

	let {status} = await User.createUser(testUser);
	
	expect(status).toBe(201);
	// TODO: Test Data
});

test('Rejects Registration with Existing E-Mail', async () => {
	let testUser = {
		'email' : 'foo@hotmail.com',
		'password': 'bar123'
	};

	let {status} = await User.createUser(testUser);

	expect(status).toBe(400);
});

test('Checks if passed E-Mail variable', async () => {
	let testUser = {
		'password': 'bar123'
	}

	let {status} = await User.createUser(testUser);

	expect(status).toBe(400);
});

test('Checks if passed Password variable', async () => {
	let testUser = {
		'email': 'testForPassword@hotmail.com'
	}

	let {status} = await User.createUser(testUser);

	expect(status).toBe(400);
});

// ~~~~~~~~~~~~~ UserService.login ~~~~~~~~~~~~~~~~
test('Accepts Login of Valid User', async () => {
	let testUser = {
		'email': 'foo@hotmail.com',
		'password': 'bar123'
	}

	let {status} = await User.login(testUser)

	expect(status).toBe(200);
});

test('Rejects Login of a Non-Existent User', async () => {
	let testUser = {
		'email': 'doesntexist@hotmail.com',
		'password': 'dntexist098'
	}

	let {status} = await User.login(testUser)

	expect(status).toBe(404);
})

test('Rejects Login with Invalid Password', async () => {
	let testUser = {
		'email': 'foo@hotmail.com',
		'password': 'invalidpassword'
	}

	let {status} = await User.login(testUser)

	expect(status).toBe(401);
})

test('Rejects Login with no E-Mail', async () => {
	let testUser = {
		'email': 'foo@hotmail.com',
		'password': 'invalidpassword'
	}

	let {status} = await User.login(testUser)

	expect(status).toBe(401);
})


// ~~~~~ User.isPresent ~~~~~~~~~~~~~~~
test('isPresent works', async () => {
	// Valid & Present email
	let isPresent = await User.isPresent('foo@hotmail.com')
	//expect(isPresent).toBe(true);

	// Not present email
	isPresent = await User.isPresent('foo@hotmail.co');
	expect(isPresent).toBe(false);

	// Edge Cases
	expect(await User.isPresent(5)).toEqual(new Error('Email must be a string!'));

	expect(await User.isPresent({'email': 'foo@hotmail.com'})).toEqual(new Error('Email must be a string!'));
});

// ~~~~~ User.updateName ~~~~~~~~~~~~~
test('updateName works', async () => {
	// Undefined parameters
	var {status} = await User.updateName();
	expect(status).toBe(400);

	// Valid parameters & User
	let testUser = { 'email': 'foo@hotmail.com ', 'name': 'FooBar' };
	
	var {status} = await User.updateName(testUser);
	expect(status).toBe(200);

	// Short Name
	testUser = { 'email': 'foo@hotmail.com', 'name': 'te' };

	var {status} = await User.updateName(testUser);
	expect(status).toBe(400);

	// Nonexistent User
	testUser = { 'email': 'doesntExist@hotmail.com ', 'name': 'D0354\'T' };

	var {status} = await User.updateName(testUser);
	expect(status).toBe(404);
})

test('deleteUser works', async () => {

	console.log(await User.deleteUser());
	//console.log(await User.deleteUser({'email': 'foo@hotmail.com'}));
	// console.log(await User.deleteUser({'email': 'foo@h'}));
	// console.log(await User.deleteUser({'email': 'foo@'}));

	// Delete a present User
	let testUser = {
		'email' : 'foo@hotmail.com'
	};

	var {status} = await User.deleteUser(testUser);
	expect(status).toBe(204);

	// Make sure it has been deleted
	let isPresent = await User.isPresent(testUser.email);
	expect(isPresent).toBe(false);

	// Nonexistent user
	testUser = {
		'email': 'doesntExist@hotmail.com'
	}
	var {status} = await User.deleteUser(testUser);
	expect(status).toBe(404);

	// Edge cases, no email given
	var {status} = await User.deleteUser();
	expect(status).toBe(400);
});

afterAll(async () => {
	await User.deleteAllUsers();
	await mongoose.connection.close();
});