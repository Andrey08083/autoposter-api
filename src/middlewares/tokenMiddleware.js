const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token');
const userModel = require('../models/user');
const { ERRORS } = require('../constants/validation');
const ApiError = require('../helpers/apiError');
const { UNAUTHORIZED } = require('../constants/responseStatus');

const verifyAccessToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (typeof (bearerHeader) !== 'string') {
    return next(new ApiError(UNAUTHORIZED, ERRORS.TOKEN_NOT_FOUND));
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
    if (err) {
      return next(new ApiError(UNAUTHORIZED, err));
    }
    const databaseToken = await tokenModel.findOne({ accessToken: token });
    if (!databaseToken) {
      return next(new ApiError(UNAUTHORIZED, ERRORS.TOKEN_NOT_FOUND));
    }

    const databaseUser = await userModel.findOne({ _id: result.user._id });
    if (!databaseUser) {
      return next(new ApiError(UNAUTHORIZED, ERRORS.USER_NOT_FOUND));
    }

    req.token = databaseToken.toJSON();
    req.user = databaseUser.toJSON();
    return next();
  });
  return null;
};

const verifyRefreshToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  console.log(bearerHeader)
  if (typeof (bearerHeader) !== 'string') {
    return next(new ApiError(UNAUTHORIZED, ERRORS.TOKEN_NOT_FOUND));
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
    if (err) {
      return next(new ApiError(UNAUTHORIZED, err));
    }
    const databaseToken = await tokenModel.findOne({ refreshToken: token });
    if (!databaseToken) {
      return next(new ApiError(UNAUTHORIZED, ERRORS.TOKEN_NOT_FOUND));
    }

    const databaseUser = await userModel.findOne({ _id: result.user._id });
    if (!databaseUser) {
      return next(new ApiError(UNAUTHORIZED, ERRORS.USER_NOT_FOUND));
    }

    req.token = databaseToken.toJSON();
    req.user = databaseUser.toJSON();
    return next();
  });
  return null;
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
