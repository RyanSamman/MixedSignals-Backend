const alpha = require('alphavantage');
const StockModel = require('../../models/StockModel');

// const stocklist = ['MSFT', 'SPY', 'GOOGL'];

class Alpha {
	constructor({ API_KEY }) {
		if (!API_KEY) throw new Error('No API Key given');
		this.API_KEY = API_KEY;
		this.alpha = alpha({ key: API_KEY });
	}

	async getAlphaData() {
		throw new Error('Not Implemented!');
	}

	async create({ name = '' } = {}) {
		if (!this.isPresent(name)) return { 'status': 400, 'error': 'Stock is already Present '};
		if (!name) return { 'status': 400 };
		let { status, ...data } = await this.getAlphaData({ name, size:'full' });
		if (status !== 200) return { status };
		try {
			let NewStock = await StockModel.create(data);
			return { 'status': 201, 'data': NewStock };
		} catch (err) {
			let error = err.name;
			if (err.name === 'MongoError') error = 'Stock is already Present';
			if (err.name === 'ValidationError') error = 'Fill in the required Fields';
			return { 'status': 400, 'error': error };
		}
	}

	/**
	 * 
	 * @param {Array} betweenDates [from_date, to_date] 
	 */
	async getData({ name = '', betweenDates='' } = {}) {
		if (!name) return { 'status': 400 };
		let stockData;
		console.log(betweenDates);
		if (!betweenDates) {
			stockData = await StockModel.findOne({ name, type: this.type });
		} else if (betweenDates[1] < betweenDates[0]) {
			stockData = await StockModel.findOne({ 
				name, 
				type: this.type,
				prices: { 
					$elemMatch: { 
						date: {	$gte: betweenDates[1], $lte: betweenDates[2] }
					}
				}
			});
		}
		
		if (!stockData) return { 'status': 404 };
		return { 'status': 200, 'data': stockData };
	}

	async isPresent(name = '') {
		if (typeof(name) !== 'string') throw new Error('Stock Symbol must be a string!');
		let dataPresent = await StockModel.findOne({ name });
		if (dataPresent) return true;
		return false;
	}

	/**
	 * if called by Class Alpha, it will list all financial records in the database
	 * Else, it will only list of records filtered to the type of the class (stock/crypto)
	 */
	async listAll() {
		let searchParams = this.type ? { type: this.type } : {};
		let records = await StockModel
			.find(searchParams)
			.select({ 'name': 1, 'latest': 1, '_id': 0, 'type': 1 })
			.sort({ 'type': 'asc', 'latest': 'desc' });
		return { 'status': 200, records };
	}

	async updateOne({ name = '' } = {}) {
		// TODO: Optimize getAlphaData to refactor the object once instead of twice, 
		// will save bit of time
		let [savedStockRecord, { status, ...data }] = await Promise.all([
			StockModel.findOne({ name, 'type': this.type }),
			this.getAlphaData({ name, size: 'compact' })
		]);

		if (!savedStockRecord) return { 'status': 404 };
		if (status !== 200) return { status, 'message': 'ALPHAERROR' };
		
		let latestDate = new Date(savedStockRecord.latest);		

		// Filter new prices to get only the new quotes
		let newPrices = []; 
		let i = 0;
		while (data.prices[i].date > latestDate) {
			newPrices.push(data.prices[i]);
			i++;
		}
		if (newPrices.length === 0) return { 'status': 200, 'message': `${name} is up-to-date`,'updated': 0 };
		
		savedStockRecord.prices = newPrices.concat(savedStockRecord.prices);
		savedStockRecord.latest = data.latest;
		let newStockData = await savedStockRecord.save();

		return { 'status': 201, 'message': `${name} has been updated`, 'updated': newPrices.length, 'data': newStockData };
	}

	/**
	 * Deletes a certain stock's prices, from a certain date to the present, inclusive
	 * @param {string} name Name of the stock to delete
	 * @param {Date} fromDate Date to start deleting from
	 */
	async deletePrices({ name = '', fromDate = new Date() } = {}) {
		if (!(process.env.DEV || process.env.CI)) return { 'status': 401, 'message': 'Must be in a CI Environment!' };
		if (!fromDate || !name ) return { 'status': 400 };
		let stockDoc = await StockModel.findOne({ name });
		if (!stockDoc) return { 'status': 404 };
		let count = 0;
		stockDoc.prices = stockDoc.prices.filter((currentQuote) => {
			if (currentQuote.date >= fromDate) {
				count++;
				return false;
			}
			return true;
		});
		stockDoc.latest = stockDoc.prices[0].date;
		let savedDoc = await stockDoc.save();
		return { 'status': 200, 'deleted': count, 'data': savedDoc };
	}

	async deleteOne({ name = '' } = {}) {
		let deletedInfo = await StockModel.deleteOne({ name });
		if (deletedInfo.n === 0) return { 'status': 404 };
		return { 'status': 204 };
	}

	async deleteAll() {
		if (!(process.env.DEV || process.env.CI)) return { 'status': 401, 'message': 'Must be in a CI Environment!' };
		let searchParams = this.type ? { type: this.type } : {};
		let deleted = await StockModel.deleteMany(searchParams);
		return { 'status': 200, 'deletedCount': deleted.n };
	}
}

module.exports = Alpha;

// Exceeding limit
// An AlphaVantage error occurred. {"Note":"Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency."}
// 401

// Invalid API Call
// An AlphaVantage error occurred. {"Error Message":"Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY."}
// 400
