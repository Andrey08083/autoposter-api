const { TelegramError } = require('node-telegram-bot-api/src/errors');
const ApiError = require('../helpers/apiError');
const { BAD_REQUEST } = require('../constants/responseStatus');

const errorHandlerMiddleware = ((err, req, res, next) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).send(err.formatErrorObject());
  }

  if (err instanceof TelegramError) {
    return res.status(BAD_REQUEST).send(new ApiError(BAD_REQUEST, err.message).formatErrorObject());
  }

  return res.status(BAD_REQUEST).send(err);
});

module.exports = {
  errorHandlerMiddleware,
};
