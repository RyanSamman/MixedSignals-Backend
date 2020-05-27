const path = require('path');

async function handle404(req, res) {
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'public', '404.html'));
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
}

module.exports = handle404;
