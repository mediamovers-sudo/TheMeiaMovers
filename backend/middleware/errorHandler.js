const { NODE_ENV } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  // Log error internally for observability
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const response = {
    error: err.message || 'An unexpected internal server error occurred.'
  };

  // Only expose stack trace and internal error details in local development
  if (NODE_ENV !== 'production') {
    response.stack = err.stack;
    response.details = err;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
