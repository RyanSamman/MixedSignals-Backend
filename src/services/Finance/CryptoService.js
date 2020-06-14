const Alpha = require('./Alpha');
const { CRYPTO_TEST_DATA } = require('./TEST_DATA');


class CryptoService extends Alpha {
	constructor({ API_KEY }) {
		super({ API_KEY });
		this.type = 'Crypto';
	}

	async getAlphaData({ name } = '') {
		if (!name) return { 'status': 400 };

		let data = {};
		try {
			// Return pre-fetched data to speed up UnitTests & Save API Calls
			data = (process.env.CI && name === 'BTC') ? // If CI env variable is present
				CRYPTO_TEST_DATA : // data = Test Data
				await this.alpha.crypto.daily(name, 'USD'); // data = API Data
			
			data = this.alpha.util.polish(data);
		} catch (err) {
			if (err.message) throw new Error(err.message);
			// Note: alphavantage errors are a string?? have no message, but give an error 
			// Exceeds API limit
			if (err.match(/An AlphaVantage error occurred....Note/)) return { 'status': 401 };
			// Invalid API call (Missing stock)
			if (err.match(/An AlphaVantage error occurred....Error/)) return { 'status': 400 };
		}

		let dates = Object.keys(data.data);
		let prices = dates.reduce((priceArray, currentDate) => {
			priceArray.push({
				date: new Date(currentDate),
				open: data.data[currentDate].market_open,
				high: data.data[currentDate].market_high,
				low: data.data[currentDate].market_low,
				close: data.data[currentDate].market_close,
				volume: data.data[currentDate].volume,
				marketcap: data.data[currentDate].cap
			});
			return priceArray;
		}, []);
		return {
			'status': 200,
			'name': name,
			'latest': new Date(prices[0].date), 
			'type': this.type,
			'prices': prices
		};
	}
}

module.exports = CryptoService;