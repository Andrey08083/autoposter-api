const ApiError = require('../helpers/apiError');
const { BAD_REQUEST } = require('../constants/responseStatus');

const errorHandlerMiddleware = ((err, req, res, next) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).send(err.formatErrorObject());
  }
  return res.status(BAD_REQUEST).send(err);
});

module.exports = {
  errorHandlerMiddleware,
};
