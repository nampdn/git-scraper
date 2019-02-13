const express = require('express');
const R = require('ramda');
const app = express();
const {getRepos} = require('./scraper');

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/repos', async (req, res) => {
  const repos = await getRepos();
  res.json(repos);
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});