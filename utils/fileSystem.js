const fs = require('fs');
const path = require('path');
const config = require('./config');

function ensureDownloadsDirectory() {
  if (!fs.existsSync(config.downloads.dir)) {
    fs.mkdirSync(config.downloads.dir, { recursive: true });
  }
}

function createWriteStream(fileName) {
  const filePath = path.join(config.downloads.dir, fileName);
  return {
    stream: fs.createWriteStream(filePath),
    path: filePath
  };
}

function deleteFile(filePath) {
  return new Promise((resolve) => {
    fs.unlink(filePath, () => resolve());
  });
}

module.exports = {
  ensureDownloadsDirectory,
  createWriteStream,
  deleteFile
};