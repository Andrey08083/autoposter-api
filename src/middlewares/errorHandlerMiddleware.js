const { TelegramError } = require('node-telegram-bot-api/src/errors');
const { Error: { ValidationError } } = require('mongoose');
const ApiError = require('../helpers/apiError');
const { BAD_REQUEST } = require('../constants/responseStatus');

const errorHandlerMiddleware = ((err, req, res, next) => {
  console.log('err', err);

  if (err instanceof ValidationError) {
    return res.status(BAD_REQUEST).send(new ApiError(BAD_REQUEST, err.message).formatErrorObject());
  }

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
