const { defaultJoiSettings } = require('../validation/validationSettings');
const ApiError = require('../helpers/apiError');
const { BAD_REQUEST } = require('../constants/responseStatus');
const { parseErrors } = require('../validation');

const validationMiddleware = (validationSchema) => (req, res, next) => {
  const { body } = req;
  const validationResult = validationSchema.validate(body, defaultJoiSettings);

  if (validationResult.error) {
    const errors = parseErrors(validationResult);

    return next(new ApiError(BAD_REQUEST, errors));
  }
  return next();
};

module.exports = {
  validationMiddleware,
};
