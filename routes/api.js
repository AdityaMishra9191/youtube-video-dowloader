const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { downloadVideo } = require('../utils/youtube');
const { handleError } = require('../utils/error');
const config = require('../utils/config');

router.post('/download', async (req, res) => {
  try {
    const { url } = req.body;
    const result = await downloadVideo(url);
    
    res.json({ 
      success: true,
      message: 'Download completed successfully!',
      fileName: result.fileName,
      title: result.title
    });
  } catch (error) {
    console.error('Download error:', error);
    const errorResponse = handleError(error);
    res.status(errorResponse.status).json(errorResponse);
  }
});

router.get('/download/:fileName', (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(config.downloads.dir, fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        code: 'FILE_NOT_FOUND'
      });
    }
    
    res.download(filePath);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.status).json(errorResponse);
  }
});

module.exports = router;