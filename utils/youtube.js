const ytdl = require('ytdl-core');
const config = require('./config');
const { validateYouTubeUrl } = require('./validators');
const { sanitizeFileName } = require('./formatters');
const { ensureDownloadsDirectory, createWriteStream, deleteFile } = require('./fileSystem');

async function getVideoInfo(url) {
  try {
    return await ytdl.getInfo(url, {
      requestOptions: {
        headers: config.youtube.headers
      }
    });
  } catch (error) {
    throw new Error(`Failed to get video info: ${error.message}`);
  }
}

async function downloadVideo(url) {
  let filePath;
  try {
    validateYouTubeUrl(url);
    ensureDownloadsDirectory();

    const info = await getVideoInfo(url);
    const videoTitle = sanitizeFileName(info.videoDetails.title);
    const fileName = `${videoTitle}.${config.downloads.defaultFormat}`;
    
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highest',
      filter: 'audioandvideo'
    });

    if (!format) {
      throw new Error('No suitable format found');
    }

    const { stream, path } = createWriteStream(fileName);
    filePath = path;

    return new Promise((resolve, reject) => {
      const video = ytdl(url, {
        format: format,
        requestOptions: {
          headers: config.youtube.headers
        }
      });

      video.pipe(stream);

      stream.on('finish', () => {
        resolve({ fileName, title: videoTitle });
      });

      stream.on('error', async (error) => {
        await deleteFile(filePath);
        reject(new Error(`File write error: ${error.message}`));
      });

      video.on('error', async (error) => {
        await deleteFile(filePath);
        reject(new Error(`Download error: ${error.message}`));
      });
    });
  } catch (error) {
    if (filePath) {
      await deleteFile(filePath);
    }
    throw new Error(`Download failed: ${error.message}`);
  }
}

module.exports = { downloadVideo, getVideoInfo };