const express = require('express');
const router = express.Router();
const { downloadVideo } = require('../utils/downloader');
const path = require('path');

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    const result = await downloadVideo(url);
    res.json({ 
      message: 'Download completed successfully!',
      fileName: result.fileName,
      title: result.title
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '..', 'downloads', fileName);
  res.download(filePath);
});

module.exports = router;