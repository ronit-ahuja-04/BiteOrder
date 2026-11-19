// Centralised error handling: 404 for unknown routes + one place that maps errors to HTTP responses.
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    suggestion: 'Visit GET / to inspect available BiteOrder REST API endpoints.',
  });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError' && err.errors) {            // Mongoose schema validation
    status = 400;
    message = `Validation Error: ${Object.values(err.errors).map((e) => e.message).join(' ')}`;
  } else if (err.name === 'CastError') {                          // malformed ObjectId etc.
    status = 400;
    message = `Invalid value for "${err.path}": ${err.value}`;
  } else if (err.code === 11000) {                                // duplicate key (unique index)
    status = 409;
    message = `Duplicate value for ${Object.keys(err.keyPattern || {}).join(', ') || 'a unique field'}.`;
  } else if (err.type === 'entity.parse.failed') {                // broken JSON body
    status = 400;
    message = 'Malformed JSON in request body.';
  } else if (status === 500) {
    console.error('Unhandled Server Error:', err);               // log the real cause on the server only
    if (isProd) message = 'Internal Server Error occurred.';      // never leak internals in production
  }

  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
