const ytdl = require('ytdl-core');

function validateYouTubeUrl(url) {
  if (!url) {
    throw new Error('URL is required');
  }
  if (!ytdl.validateURL(url)) {
    throw new Error('Invalid YouTube URL');
  }
  return true;
}

module.exports = { validateYouTubeUrl };