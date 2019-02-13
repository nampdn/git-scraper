// server.js
// where your node app starts

// init project
const express = require('express');
const R = require('ramda');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const scrapeIt = require("scrape-it")
 
const fetchRepos = async (page) => {
  const result = await scrapeIt("https://git.door43.org/vgm?sort=recentupdate&page=1&q=&tab=", {
    repos: {
      listItem: ".repository a"
    }
  })
  return result;
}

const flatRepoList = (repos) => {
  const flatter = R.pipe(R.map((element) => element.repos), R.reduce(R.concat, []))
  return flatter(repos)
}

const main = async () => {
  const TOTAL_PAGES = 16;
  const allRepos = [];
  for (let i = 0; i < TOTAL_PAGES; i++) {
    allRepos.push(fetchRepos(i));
  }
  const totals = await Promise.all(allRepos);
  const repos = flatRepoList(totals.map(pageData => pageData.data));
  console.log(`Total repos: ${repos.length}`);
}

// Promise interface
main().catch((err) => {
  console.log(err)
});