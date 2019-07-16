require('dotenv').config();
const request = require('request');
const fs = require('fs');

const args = process.argv.slice(2);
const repoOwner = args[0];
const repoName = args[1];

console.log('Welcome to the GitHub Avatar Downloader!');

function downloadImageByURL(url, filePath) {
  request(url)
    .on('error', (err) => {
      console.warn('error:', err);
    })
    .pipe(fs.createWriteStream(filePath));
}

function contributorsAvatarURL(err, data, body) {
  if (err) {
    console.warn('error:', err);
    return;
  }

  const contributors = JSON.parse(body);
  contributors.forEach((contributor) => {
    downloadImageByURL(contributor.avatar_url, `./avatars/${contributor.login}.jpg`);
  });
  console.log('avatar download complete');
}

function getRepoContributors(owner, name, cb) {
  if (!owner || !name) {
    console.log('You must provide a repository owner and name in your request');
    return;
  }
  const options = {
    url: `https://api.github.com/repos/${owner}/${name}/contributors`,
    headers: {
      'User-Agent': 'request',
      Authorization: process.env.GITHUB_TOKEN,
    },
  };

  request(options, (err, res, body) => {
    cb(err, res, body);
  });
}

getRepoContributors(repoOwner, repoName, contributorsAvatarURL);
