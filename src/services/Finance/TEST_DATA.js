// Snapshot of API Data used for testing purposes
const STOCK_TEST_DATA = {
	'Meta Data': {
		'1. Information': 'Daily Prices (open, high, low, close) and Volumes',
		'2. Symbol': 'MSFT',
		'3. Last Refreshed': '2020-06-09',
		'4. Output Size': 'Full size',
		'5. Time Zone': 'US/Eastern'
	},
	'Time Series (Daily)': {
		'2020-06-04': {
			'1. open': '184.3000',
			'2. high': '185.8400',
			'3. low': '182.3000',
			'4. close': '182.9200',
			'5. volume': '28761809'
		},
		'2020-06-03': {
			'1. open': '184.8150',
			'2. high': '185.9400',
			'3. low': '183.5800',
			'4. close': '185.3600',
			'5. volume': '27311016'
		},
		'2020-06-02': {
			'1. open': '184.2500',
			'2. high': '185.0000',
			'3. low': '181.3500',
			'4. close': '184.9100',
			'5. volume': '30794585'
		},
		'2020-06-01': {
			'1. open': '182.5400',
			'2. high': '183.0000',
			'3. low': '181.4600',
			'4. close': '182.8300',
			'5. volume': '22668821'
		}
	}
};
  

const CRYPTO_TEST_DATA = {
	'Meta Data': {
		'1. Information': 'Daily Prices and Volumes for Digital Currency',
		'2. Digital Currency Code': 'BTC',
		'3. Digital Currency Name': 'Bitcoin',
		'4. Market Code': 'USD',
		'5. Market Name': 'United States Dollar',
		'6. Last Refreshed': '2020-06-09 00:00:00',
		'7. Time Zone': 'UTC'
	},
	'Time Series (Digital Currency Daily)': {
		'2020-06-04': {
			'1a. open (USD)': '9666.32000000',
			'1b. open (USD)': '9666.32000000',
			'2a. high (USD)': '9881.63000000',
			'2b. high (USD)': '9881.63000000',
			'3a. low (USD)': '9450.00000000',
			'3b. low (USD)': '9450.00000000',
			'4a. close (USD)': '9789.06000000',
			'4b. close (USD)': '9789.06000000',
			'5. volume': '57456.10096900',
			'6. market cap (USD)': '57456.10096900'
		},
		'2020-06-03': {
			'1a. open (USD)': '9518.02000000',
			'1b. open (USD)': '9518.02000000',
			'2a. high (USD)': '9690.00000000',
			'2b. high (USD)': '9690.00000000',
			'3a. low (USD)': '9365.21000000',
			'3b. low (USD)': '9365.21000000',
			'4a. close (USD)': '9666.24000000',
			'4b. close (USD)': '9666.24000000',
			'5. volume': '46252.64493900',
			'6. market cap (USD)': '46252.64493900'
		},
		'2020-06-02': {
			'1a. open (USD)': '10202.71000000',
			'1b. open (USD)': '10202.71000000',
			'2a. high (USD)': '10228.99000000',
			'2b. high (USD)': '10228.99000000',
			'3a. low (USD)': '9266.00000000',
			'3b. low (USD)': '9266.00000000',
			'4a. close (USD)': '9518.04000000',
			'4b. close (USD)': '9518.04000000',
			'5. volume': '108970.77315100',
			'6. market cap (USD)': '108970.77315100'
		},
		'2020-06-01': {
			'1a. open (USD)': '9448.27000000',
			'1b. open (USD)': '9448.27000000',
			'2a. high (USD)': '10380.00000000',
			'2b. high (USD)': '10380.00000000',
			'3a. low (USD)': '9421.67000000',
			'3b. low (USD)': '9421.67000000',
			'4a. close (USD)': '10200.77000000',
			'4b. close (USD)': '10200.77000000',
			'5. volume': '76649.12696000',
			'6. market cap (USD)': '76649.12696000'
		}
	}
};

module.exports = { STOCK_TEST_DATA, CRYPTO_TEST_DATA };