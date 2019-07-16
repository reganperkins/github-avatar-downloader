const request = require('request');
const { GITHUB_TOKEN } = require('./secrets.js');

const args = process.argv.slice(2);
const repoOwner = args[0];
const repoName = args[1];

console.log('Welcome to the GitHub Avatar Downloader!');

function sortContributors(err, data) {
  console.log('Errors:', err);
  console.log('Result:', data);
}

function getRepoContributors(owner, name, cb) {
  const options = {
    url: `https://api.github.com/repos/${owner}/${name}/contributors`,
    headers: {
      'User-Agent': 'request',
      Authorization: GITHUB_TOKEN,
    },
  };

  request(options, (err, res, body) => {
    cb(err, res);
  });
}

getRepoContributors(repoOwner, repoName, sortContributors);
