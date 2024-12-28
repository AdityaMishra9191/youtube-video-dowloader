function sanitizeFileName(title) {
  // More thorough filename sanitization
  return title
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphen
    .replace(/\s+/g, '_')     // Replace spaces with underscores
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();                  // Remove leading/trailing spaces
}

function getVideoFormat(formats) {
  // Sort formats by quality (highest first)
  const sortedFormats = formats
    .filter(f => f.hasVideo && f.hasAudio)
    .sort((a, b) => {
      const qualityA = parseInt(a.qualityLabel) || 0;
      const qualityB = parseInt(b.qualityLabel) || 0;
      return qualityB - qualityA;
    });

  const format = sortedFormats[0];
  
  if (!format) {
    throw new Error('No suitable video format found');
  }
  
  return format;
}

module.exports = { sanitizeFileName, getVideoFormat };