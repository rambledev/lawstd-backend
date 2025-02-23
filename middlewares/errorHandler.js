const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
};

module.exports = { createError, errorHandler };