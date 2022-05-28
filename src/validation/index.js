const { ValidationError } = require('joi');
const { CUSTOM_ERROR_MESSAGES } = require('../constants/validation');

/**
 * Constructs custom error message
 * @param error joi error object
 * @returns {String} error message string
 */
const getErrorMessage = (error) => {
  if (!error.path) return error.message;
  const errorPath = `${error.path.join('.')}.${error.context.label}`;

  if (!CUSTOM_ERROR_MESSAGES[errorPath]) {
    return error.message;
  }
  return CUSTOM_ERROR_MESSAGES[errorPath];
};

const parseErrors = (validationResult) => {
  const errors = [];

  if (!(validationResult.error instanceof ValidationError)) return [];
  const { error } = validationResult;

  for (const errorObject of error.details) {
    if (errorObject.type !== 'any.custom') {
      errors.push(getErrorMessage(errorObject));
    }
  }
  return errors;
};

module.exports = {
  parseErrors,
  getErrorMessage,
};
