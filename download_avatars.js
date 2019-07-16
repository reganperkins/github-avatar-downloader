const request = require('request');
const { GITHUB_TOKEN } = require('./secrets.js');

const args = process.argv.slice(2);
const repoOwner = args[0];
const repoName = args[1];

console.log('Welcome to the GitHub Avatar Downloader!');

function contributorsAvatarURL(err, data, body) {
  if (err) {
    console.warn('error:', err);
    return;
  }

  const contributors = JSON.parse(body);
  for (contributor of contributors) {
    // console.log(contributor.avatar_url)
    downloadImageByURL(contributor.avatar_url, `./avatars/${contributor.login}`);
  }
}

function downloadImageByURL(url, filePath) {
  request(url)
    .on('data', (data) => {
      console.log(data)
    })
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
    cb(err, res, body);
  });
}

getRepoContributors(repoOwner, repoName, contributorsAvatarURL);
