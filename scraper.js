const R = require('ramda');
const scrapeIt = require("scrape-it");
 
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

const getRepos = async () => {
  const TOTAL_PAGES = 16;
  const allRepos = [];
  for (let i = 0; i < TOTAL_PAGES; i++) {
    allRepos.push(fetchRepos(i));
  }
  const totals = await Promise.all(allRepos);
  const repos = flatRepoList(totals.map(pageData => pageData.data));
  return repos;
}

module.exports = {getRepos: getRepos};