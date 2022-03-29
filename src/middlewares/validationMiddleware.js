const { defaultJoiSettings } = require('../validation/validationSettings');
const ApiError = require('../helpers/apiError');
const { BAD_REQUEST } = require('../constants/responseStatus');

const validationMiddleware = (validationSchema) => (req, res, next) => {
  const { body } = req;
  const validationResult = validationSchema.validate(body, defaultJoiSettings);

  if (validationResult.error) {
    return next(new ApiError(BAD_REQUEST, validationResult.error));
  }
  return next();
};

module.exports = {
  validationMiddleware,
};
