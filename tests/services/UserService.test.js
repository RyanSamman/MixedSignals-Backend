//import {describe, expect, it, beforeAll, test, } from '@jest/globals';
const ORIGINAL_ENV = process.env;
const mongoose = require('mongoose');
const chalk = require('chalk');
const color = chalk.bgBlue.black; // Colors each function for visibility
const config = require('./../../src/config');
const UserService = require('./../../src/services/Users/UserService');
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

afterAll(async () => {
	await mongoose.connection.close();
});

test('Test has a CI environment', () => {
	expect(process.env.CI).toBeTruthy();
});

// ~~~~~~~~~~~~~ User.createUser ~~~~~~~~~~~~~~~~~~~~
describe(color('.createUser'), () => {
	test('Registers a New User', async () => {
		let testUser = { 'email': 'foo@hotmail.com', 'password': 'bar123' };
		let {status, data} = await User.createUser(testUser);
		expect(status).toBe(201);
		expect(data.email).toBe('foo@hotmail.com')
	});

	test('Rejects Registration with Existing E-Mail', async () => {
		let testUser = { 'email' : 'foo@hotmail.com', 'password': 'bar123' };
		let {status} = await User.createUser(testUser);
		expect(status).toBe(400);
	});

	test('Checks for E-Mail', async () => {
		let testUser = { 'password': 'bar123' };
		let {status} = await User.createUser(testUser);
		expect(status).toBe(400);
	});

	test('Checks for Password', async () => {
		let testUser = { 'email': 'testForPassword@hotmail.com' };
		let {status} = await User.createUser(testUser);
		expect(status).toBe(400);
	});
});


// ~~~~~~~~~~~~~ UserService.login ~~~~~~~~~~~~~~~~
describe(color('.login'), () => {
	test('Accepts Valid User', async () => {
		let testUser = { 'email': 'foo@hotmail.com', 'password': 'bar123' };
		let {status} = await User.login(testUser);
		expect(status).toBe(200);
	});
	
	test('Rejects Non-Existent User', async () => {
		let testUser = { 'email': 'doesntexist@hotmail.com', 'password': 'dntexist098' };	
		let {status} = await User.login(testUser);
		expect(status).toBe(404);
	});
	
	test('Rejects Invalid Password', async () => {
		let testUser = { 'email': 'foo@hotmail.com', 'password': 'invalidpassword' };
	
		let {status} = await User.login(testUser)
	
		expect(status).toBe(401);
	});
	
	test('Checks for E-Mail', async () => {
		let testUser = { 'email': 'foo@hotmail.com', 'password': 'invalidpassword' };
		let {status} = await User.login(testUser)
		expect(status).toBe(401);
	});
});


// ~~~~~ User.isPresent ~~~~~~~~~~~~~~~
describe(color('.isPresent'), () => {
	test('Returns true for Existing User', async () => {
		let isPresent = await User.isPresent('foo@hotmail.com')
		expect(isPresent).toBe(true);
	});

	test('Returns false for Non-Existent User', async () => {
		isPresent = await User.isPresent('foo@hotmail.co');
		expect(isPresent).toBe(false);
	});
		
	test('Throws Error when given a non-string value', async () => {
		await expect(User.isPresent(5)).rejects.toThrow(Error);
		await expect(User.isPresent({'email': 'foo@hotmail.com'})).rejects.toThrow(Error);
	});
});


// ~~~~~ User.updateName ~~~~~~~~~~~~~
describe(color('.updateName'), () => {	
	test('Updates name of an Existing User', async () => {
		let testUser = { 'email': 'foo@hotmail.com ', 'name': 'FooBar' };
		let {status, data} = await User.updateName(testUser);
		expect(status).toBe(200);
	});
	
	test('Rejects bad name (Too Short / Has Spaces) for an Existing User', async () => {
		let testUser = { 'email': 'foo@hotmail.com', 'name': 'te' };
		let {status} = await User.updateName(testUser);
		expect(status).toBe(400);

		testUser = { 'email': 'foo@hotmail.com', 'name': 'Contains Spaces' };
		({status} = await User.updateName(testUser));
		expect(status).toBe(400);
	});

	test('Returns 404 when User is not found', async () => {
		testUser = { 'email': 'doesntExist@hotmail.com ', 'name': 'D0354\'T' };
		let {status} = await User.updateName(testUser);
		expect(status).toBe(404);
	});

	test('Handles undefined values', async () => {
		let status;
		({status} = await User.updateName());
		expect(status).toBe(400);
		({status} = await User.updateName({'email': 'doesntExist@hotmail.com'}));
		expect(status).toBe(400);
		({status} = await User.updateName({'name': 'NoE-mail'}));
		expect(status).toBe(400);
	});
});

describe(color('.findAllUsers'), () => {
	test('Finds users', async () => {
		process.env.CI = 'true';
		let { status, users } = await User.findAllUsers();
		expect(status).toBe(200);
		expect(users.length).toBe(1);
		process.env = ORIGINAL_ENV;
	});

	test('Checks for Dev/CI environment', async () => {
		process.env.CI = '';
		let { status } = await User.findAllUsers(); 
		expect(status).toBe(401);
		process.env = ORIGINAL_ENV;
	});
});


describe(color('.deleteUser'), () => {
	test('Deletes existing user', async () => {
		let {status} = await User.deleteUser({'email' : 'foo@hotmail.com'});
		expect(status).toBe(204);
		// Make sure it has been deleted
		let isPresent = await User.isPresent('foo@hotmail.com');
		expect(isPresent).toBe(false);
	});

	test('Rejects non-existant user', async () => {
		let {status} = await User.deleteUser({'email': 'doesntExist@hotmail.com'});
		expect(status).toBe(404);
	});
	
	test('Handles non-existent values', async () => {
		let {status} = await User.deleteUser();
		expect(status).toBe(404);		
	});
});

describe(color('.deleteAllUsers'), () => {

	test('401 w/o Dev/CI Environment', async () => {
		process.env.CI = '';
		let { status } = await User.deleteAllUsers();
		expect(status).toBe(401);
		process.env = ORIGINAL_ENV;
	});

	test('Works w Dev/CI Environment', async () => {
		// TODO: Fix this, find out why it isnt updating, are tests sync or async?
		process.env.CI = 'true';
		let { status, deletedCount } = await User.deleteAllUsers();
		expect(status).toBe(200);
		// If this fails, that means another user was created in the test
		// other than foo@hotmail.com, that wasn't deleted before this
		expect(deletedCount).toBe(0);
		process.env = ORIGINAL_ENV;
	});
});