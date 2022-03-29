const { defaultJoiSettings } = require('./validationSettings');
const { BAD_REQUEST } = require('../constants/responseStatus');
const ApiError = require('../helpers/apiError');

// NOTE: Deprecated (at least now)
module.exports = (validationSchema, body) => {
  const validationResult = validationSchema.validate(body, defaultJoiSettings);
  if (validationResult.error) {
    throw new ApiError(BAD_REQUEST, validationResult.error);
  }
};
