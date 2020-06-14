// Route: ~/api/stocks

const express = require('express');
const router = express.Router();

const config = require('../config');
const AlphaService = require('../services/Finance/Alpha');
const StockService = require('../services/Finance/StockService');
const CryptoService = require('../services/Finance/CryptoService');
const Alpha = new AlphaService(config);
const Stocks = new StockService(config);
const Crypto = new CryptoService(config);

router.get('/list', async (req, res) => {
	let { status, ...data } = await Alpha.listAll();
	res.status(status).json(data);
});


/**
 * @route api/stocks/create
 * Creates stock resource
 * @param req.body.name
 */
router.post('/create', async (req, res) => {
	let status, data;
	switch (req.body.type) {
	case 'stock':
		({ status, ...data } = await Stocks.create(req.body));
		break;
	case 'crypto':
		({ status, ...data } = await Crypto.create(req.body));
		break;
	default:
		status = 400;
		data = { 'error': 'Bad Request' };
		break;
	}

	res.status(status).json(data);
});

/**
 * @route api/stocks/getdata
 * Retrieves stock data from Database
 * @param {string} name Name of the stock to query
 * @param {string} type crypto or stock
 * 
 * @returns status - 400 if OK,
 */
router.get('/get', async (req, res) => {
	let status, data;
	switch (req.body.type) {
	case 'stock':
		({ status, ...data } = await Stocks.getData(req.body));
		break;
	case 'crypto':
		({ status, ...data } = await Crypto.getData(req.body));
		break;
	default:
		status = 400;
		data = { 'error': 'Bad Request' };
		break;
	}

	res.status(status).json(data);
});

/**
 * @route api/stocks/getdata
 * Retrieves stock data from Database
 * @param {string} name Name of the stock to query
 * @param {Date} fromDate 
 * @param {Date} toDate
 */
router.get('/get', async (req, res) => {
	let status, data;
	switch (req.body.type) {
	case 'stock':
		({ status, ...data } = await Stocks.getData(req.body));
		break;
	case 'crypto':
		({ status, ...data } = await Crypto.getData(req.body));
		break;
	default:
		status = 400;
		data = { 'error': 'Bad Request' };
		break;
	}

	res.status(status).json(data);
});

/**
 * @route api/stocks/getdata
 * Retrieves stock data from Database
 * @param {string} name Name of the stock to query
 * @param {Date} fromDate 
 * @param {Date} toDate
 */
router.put('/update', async (req, res) => {
	let status, data;
	switch (req.body.type) {
	case 'stock':
		({ status, ...data } = await Stocks.updateOne(req.body));
		break;
	case 'crypto':
		({ status, ...data } = await Crypto.updateOne(req.body));
		break;
	default:
		status = 400;
		data = { 'error': 'Bad Request' };
		break;
	}

	res.status(status).json(data);
});


module.exports = router;
