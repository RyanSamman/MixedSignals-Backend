//import {describe, expect, it, beforeAll, test, } from '@jest/globals';
const ORIGINAL_ENV = process.env;

const mongoose = require('mongoose');
const chalk = require('chalk');
const color = chalk.bgBlue.black; // Colors each function for visibility

const config = require('./../../src/config');

const AlphaService = require('../../src/services/Finance/Alpha');
const StockService = require('../../src/services/Finance/StockService');
const CryptoService = require('../../src/services/Finance/CryptoService');

const Alpha = new AlphaService(config);
const Stock = new StockService(config);
const Crypto = new CryptoService(config);

// TODO: More strictness when using the Alpha Class? or is that even needed?

beforeAll(async () => {
	let {MONGO_URI, TEST_DB_NAME:DB_NAME} = config;
	await mongoose.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		dbName: DB_NAME,
	});
	await Alpha.deleteAll()
}, 20000);


afterAll(async () => {
	await Alpha.deleteAll();
	await mongoose.connection.close();
});

test('Test has a CI environment', () => {
	expect(process.env.CI).toBeTruthy();
});

describe(color('.getAlphaData'), () => {
	// To save API calls, we will not test this method here, but as a component of .create
	test('Alpha Class throws Error', async () => {
		await expect(Alpha.getAlphaData()).rejects.toThrow(Error);
	});

	test('Returns 400 with Invalid Parameters', async () => {
		let status;
		({ status } = await Stock.getAlphaData());
		expect(status).toBe(400);
		({ status } = await Crypto.getAlphaData());
		expect(status).toBe(400);
	});
});


describe(color('.create'), () => {
	test('Stock - works with Normal Input', async () => {
		let { status, ...data } = await Stock.create({ 'name': 'MSFT', 'size': 'full' });
		expect(status).toBe(201);
		expect(data.data.type).toBe('Stock');
		expect(data.data.latest).toEqual(data.data.prices[0].date);
	});

	test('Crypto - works with Normal Input', async () => {
		let { status, ...data } = await Crypto.create({ 'name': 'BTC', 'size': 'full' });
		expect(status).toBe(201);
		expect(data.data.type).toBe('Crypto');
		expect(data.data.latest).toEqual(data.data.prices[0].date);
	});

	test('Stock - Checks for duplicates', async () => {
		let { status } = await Stock.create({ 'name': 'MSFT', 'size': 'full' });
		expect(status).toBe(400);
	});

	test('Crypto - Checks for duplicates', async () => {
		let { status } = await Crypto.create({ 'name': 'BTC', 'size': 'full' });
		expect(status).toBe(400);
	});

	test('Stock - Checks for symbol', async () => {
		let { status } = await Stock.create();
		expect(status).toBe(400);
	});

	test('Crypto - Checks for symbol', async () => {
		let { status } = await Crypto.create();
		expect(status).toBe(400);
	});
});


describe(color('.getData'), () => {
	test('Stock - Retrieves data correctly', async () => {
		let { status, data } = await Stock.getData({ 'name': 'MSFT' });
		expect(status).toBe(200);
		expect(data.name).toBe('MSFT');
	});

	test('Crypto - Retrieves data correctly', async () => {
		let { status, data } = await Crypto.getData({ 'name': 'BTC' });
		expect(status).toBe(200);
		expect(data.name).toBe('BTC');
	});

	test('Stock - 404 Works', async () => {
		let { status } = await Stock.getData({ 'name': 'NULL' });
		expect(status).toBe(404);
	});

	test('Crypto - 404 Works', async () => {
		let { status } = await Crypto.getData({ 'name': 'NULL' });
		expect(status).toBe(404);
	});
});

describe(color('.isPresent'), () => {
	test('Stock - Returns true for Existing Stock', async () => {
		let isPresent = await Stock.isPresent('MSFT')
		expect(isPresent).toBe(true);
	});

	test('Crypto - Returns true for Existing Crypto', async () => {
		let isPresent = await Crypto.isPresent('MSFT')
		expect(isPresent).toBe(true);
	});

	test('Stock - Returns false for Non-Existent Stock', async () => {
		isPresent = await Stock.isPresent('NULL');
		expect(isPresent).toBe(false);
	});

	test('Crypto - Returns false for Non-Existent Crypto', async () => {
		isPresent = await Crypto.isPresent('NULL');
		expect(isPresent).toBe(false);
	});
		
	test('Stock - Throws Error when given a non-string value', async () => {
		await expect(Stock.isPresent(5)).rejects.toThrow(Error);
		await expect(Stock.isPresent({'name': 'MSFT'})).rejects.toThrow(Error);
	});

	test('Crypto - Throws Error when given a non-string value', async () => {
		await expect(Crypto.isPresent(5)).rejects.toThrow(Error);
		await expect(Crypto.isPresent({'name': 'MSFT'})).rejects.toThrow(Error);
	});
});

describe(color('.listAll'), () => {
	test('Alpha - Finds all records', async () => {
		let { status, records } = await Alpha.listAll();
		expect(status).toBe(200);
		let found = records.find((record) => (record.name === 'MSFT') ? true : false );
		expect(found.name).toBe('MSFT'); 
		found = records.find((record) => (record.name === 'BTC') ? true : false );
		expect(found.name).toBe('BTC'); 
	});

	test('Stock - Finds all records', async () => {
		let { status, records } = await Stock.listAll();
		expect(status).toBe(200);
		let found = records.find((record) => (record.name === 'MSFT') ? true : false );
		expect(found.name).toBe('MSFT'); 
		found = records.find((record) => (record.name === 'BTC') ? true : false );
		expect(found).toBe(undefined); 
	});

	test('Crypto - Finds all records', async () => {
		let { status, records } = await Crypto.listAll();
		expect(status).toBe(200);
		let found = records.find((record) => (record.name === 'MSFT') ? true : false );
		expect(found).toBe(undefined); 
		found = records.find((record) => (record.name === 'BTC') ? true : false );
		expect(found.name).toBe('BTC'); 
	});
});


describe(color('.deletePrices'), () => {

	test('Stock - Deletes prices Sucessfully', async () => {
		let { status, deleted } = await Stock.deletePrices({ 'name': 'MSFT', 'fromDate': new Date('2020-06-03')});
		expect(status).toBe(200);
		expect(deleted).toBe(2);
	});

	test('Crypto - Deletes prices Sucessfully', async () => {
		let { status, deleted } = await Crypto.deletePrices({ 'name': 'BTC', 'fromDate': new Date('2020-06-03')});
		expect(status).toBe(200);
		expect(deleted).toBe(2);
	});

	test('Stock - 404', async () => {
		let { status } = await Stock.deletePrices({ 'name': 'NULL', 'fromDate': new Date('2020-06-03')});
		expect(status).toBe(404);
	});

	test('Crypto - 404', async () => {
		let { status } = await Crypto.deletePrices({ 'name': 'NULL', 'fromDate': new Date('2020-06-03')});
		expect(status).toBe(404);
	});

});


describe(color('.updateOne'), () => {
	test('Stock - Updates prices Sucessfully', async () => {
		let { status, updated } = await Stock.updateOne({ 'name': 'MSFT' });
		expect(status).toBe(201);
		expect(updated).toBe(2);
	});

	test('Crypto - Updates prices Sucessfully', async () => {
		let { status, updated } = await Crypto.updateOne({ 'name': 'BTC' });
		expect(status).toBe(201);
		expect(updated).toBe(2);
	});

	test('Stock - Checks if up-to-date', async () => {
		let { status, updated } = await Stock.updateOne({ 'name': 'MSFT' });
		expect(status).toBe(200);
		expect(updated).toBe(0);
	});

	test('Crypto - Updates prices Sucessfully', async () => {
		let { status, updated } = await Crypto.updateOne({ 'name': 'BTC' });
		expect(status).toBe(200);
		expect(updated).toBe(0);
	});

	test('Stock - 404', async () => {
		let { status } = await Stock.updateOne({ 'name': 'NUL' });
		expect(status).toBe(404);
	});

	test('Crypto - 404', async () => {
		let { status } = await Crypto.updateOne({ 'name': 'NUL' });
		expect(status).toBe(404);
	});
});


describe(color('.deleteOne'), () => {
	test('Stock - Updates prices Sucessfully', async () => {
		let { status } = await Stock.deleteOne({ 'name': 'MSFT' });
		expect(status).toBe(204);
	});

	test('Crypto - Updates prices Sucessfully', async () => {
		let { status } = await Crypto.deleteOne({ 'name': 'BTC' });
		expect(status).toBe(204);
	});

	test('Stock - 404', async () => {
		let { status } = await Stock.deleteOne({ 'name': 'NUL' });
		expect(status).toBe(404);
	});

	test('Crypto - 404', async () => {
		let { status } = await Crypto.deleteOne({ 'name': 'NUL' });
		expect(status).toBe(404);
	});
});


describe(color('.deleteAll'), () => {
	test(' - Create new records for testing - ', async () => {
		let status, data;
		({ status, ...data } = await Stock.create({ 'name': 'MSFT', 'size': 'full' }));
		expect(status).toBe(201);
		expect(data.data.type).toBe('Stock');

		({ status, ...data } = await Crypto.create({ 'name': 'BTC', 'size': 'full' }));
		expect(status).toBe(201);
		expect(data.data.type).toBe('Crypto');
	});

	test('Alpha - Deletes all', async () => {
		let { status, deletedCount } = await Alpha.deleteAll();
		expect(status).toBe(200);
		expect(deletedCount).toBe(2);
	});

	test(' - Create new records for testing - ', async () => {
		let status, data;
		({ status, ...data } = await Stock.create({ 'name': 'MSFT', 'size': 'full' }));
		expect(status).toBe(201);
		expect(data.data.type).toBe('Stock');

		({ status, ...data } = await Crypto.create({ 'name': 'BTC', 'size': 'full' }));
		expect(status).toBe(201);
		expect(data.data.type).toBe('Crypto');
	});


	test('Stock - Deletes Only Stock', async () => {
		let { status, deletedCount } = await Stock.deleteAll();
		expect(status).toBe(200);
		expect(deletedCount).toBe(1);
	});

	test('Crypto - Deletes Only Crypto', async () => {
		let { status, deletedCount } = await Crypto.deleteAll();
		expect(status).toBe(200);
		expect(deletedCount).toBe(1);
	});
});

