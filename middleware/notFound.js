/**
 * Middleware to handle unmatched routes (404 Not Found).
 * Always returns structured JSON response.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
