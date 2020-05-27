// Mongoose Stocks Model
const express = require('express');

const router = express.Router();

// Initialize AlphaVantage API
const alphavantage = require('alphavantage');

const config = require('../config');


const Stock = require('../models/Stocks');

const alpha = alphavantage({ key: config.API_KEY });

// Display demo API data

// TODO: Remake to accept a stock type & symbol & Timescale
router.get('/:symbol', async (req, res) => {
  Stock.find({ name: req.params.symbol }, (err, data) => {
    if (err) {
      return res.status(418).send(err);
    }
    return res.status(200).send(data);
  });
});

// Save API Data to Database
// Ex: type = Crypto ;
router.post('/save', async (req, res) => {
  // TODO: implement middleware to strip & check inputs
  // Accepts arguments: type, symbol
  // Type must be "Crypto" or "Stocks", whitespace stripped
  // Symbol must be 2-4 letters long, must give valid output or 404
  console.log(req.body);

  // const InputStock = new Stock();

  if (req.body.type === 'Crypto') {
    alpha.data.daily(req.body.symbol)
      .then((data) => alpha.util.polish(data))
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(404).json(err));
  } else if (req.body.type === 'Stocks') {
    alpha.crypto.daily(req.body.symbol)
      .then((data) => alpha.util.polish(data))
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(404).json(err));
  }
});

// Get from database
router.get('/', async (req, res) => {
  console.log(req.query);
  Stock.find({ name: req.query.name }, (err, data) => {
    if (err) return res.status(418).send(err);
    return res.status(200).send(data);
  });
});

router.get('/alpha/:symbol', async (req, res) => {
  console.log(req.path);
  try {
    const data = await alpha.data.daily(req.params.symbol);
    res.json(alpha.util.polish(data));
  } catch (err) {
    res.status(403);
    console.log(err);
    res.json(err);
  }
});


module.exports = router;
