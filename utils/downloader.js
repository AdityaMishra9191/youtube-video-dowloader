const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const downloadsDir = path.join(__dirname, '..', 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

async function downloadVideo(url) {
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL');
    }

    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    const fileName = `${videoTitle}.mp4`;
    const filePath = path.join(downloadsDir, fileName);

    // Get the best format that includes both video and audio
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestvideo',
      filter: 'audioandvideo'
    });

    if (!format) {
      throw new Error('No suitable format found');
    }

    return new Promise((resolve, reject) => {
      const video = ytdl(url, {
        format: format,
        requestOptions: {
          headers: {
            'Cookie': info.cookies.join('; '),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        }
      });

      video.pipe(fs.createWriteStream(filePath))
        .on('finish', () => resolve({ fileName, title: videoTitle }))
        .on('error', reject);

      video.on('error', (err) => {
        reject(new Error(`Download failed: ${err.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
}

module.exports = { downloadVideo };