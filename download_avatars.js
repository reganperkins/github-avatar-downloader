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

  // create destination file if it does not exist
  const destinationPath = './avatars';
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath);
  }

  const contributors = JSON.parse(body);
  contributors.forEach((contributor) => {
    downloadImageByURL(contributor.avatar_url, `${destinationPath}/${contributor.login}.jpg`);
  });
  console.log('avatar download complete');
}

function getRepoContributors(owner, name, cb) {
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

function init() {
  if (args.length !== 2) {
    throw new Error('incorrect number of arguments where supplied. A repo owner and name should be provided');
  }
  if (!fs.existsSync('./.env')) {
    throw new Error('you have not set up a .env file');
  }
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('you must add your GITHUB_TOKEN to .env');
  }

  getRepoContributors(repoOwner, repoName, contributorsAvatarURL);
}

init();