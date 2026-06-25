const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware factory that runs express-validator validations
 * and returns 400 with error details if validation fails
 * @param {Array} validations - Array of express-validator validation chains
 * @returns {Function} Express middleware
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return next(new ApiError(400, 'Validation failed', extractedErrors));
  };
};

module.exports = { validate };
