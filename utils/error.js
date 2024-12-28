class DownloadError extends Error {
  constructor(message, code = 'DOWNLOAD_ERROR') {
    super(message);
    this.name = 'DownloadError';
    this.code = code;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
  }
}

function handleError(error) {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: 400
    };
  }

  if (error instanceof DownloadError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: 500
    };
  }

  return {
    success: false,
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500
  };
}

module.exports = {
  DownloadError,
  ValidationError,
  handleError
};