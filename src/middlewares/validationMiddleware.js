const { defaultJoiSettings } = require('../validation/validationSettings');

// NOTE: Do I really need this?
const validationMiddleware = (validationSchema) => (req, res, next) => {
  const { body } = req;
  const validationResult = validationSchema.validate(body, defaultJoiSettings);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }
  return next();
};

module.exports = {
  validationMiddleware,
};
