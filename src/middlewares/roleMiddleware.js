const ApiError = require('../helpers/apiError');

const { BAD_REQUEST } = require('../constants/responseStatus');

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(BAD_REQUEST));
  }

  return next();
};

module.exports = {
  roleMiddleware,
};
