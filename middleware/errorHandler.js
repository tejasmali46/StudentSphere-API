/**
 * Centralized error handling middleware.
 * Formats errors into consistent JSON responses without leaking credentials or stack traces.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = undefined;

  // 1. JSON parsing syntax error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body. Please verify your JSON syntax.';
  }

  // 2. Mongoose Invalid ObjectId (CastError)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}': '${err.value}'. Expected a valid MongoDB ObjectId.`;
  }

  // 3. Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // 4. MongoDB Duplicate Key Error (E11000)
  else if (err.code === 11000) {
    statusCode = 409; // Conflict
    const duplicateFields = Object.keys(err.keyPattern || err.keyValue || {});
    const fieldName = duplicateFields[0] || 'field';
    const fieldValue = err.keyValue ? err.keyValue[fieldName] : '';
    message = `A student record with ${fieldName.toUpperCase()} '${fieldValue}' already exists.`;
    errors = [
      {
        field: fieldName,
        message: `${fieldName.toUpperCase()} must be unique. '${fieldValue}' is already registered.`,
      },
    ];
  }

  // Ensure status code is valid
  if (statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }

  const responseBody = {
    success: false,
    message,
  };

  if (errors) {
    responseBody.errors = errors;
  }

  // Only expose stack trace in non-production environments when specifically requested
  if (process.env.NODE_ENV === 'test_debug') {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;
