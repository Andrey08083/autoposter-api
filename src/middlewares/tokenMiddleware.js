const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token');
const userModel = require('../models/user');
const { ERRORS } = require('../constants/validation');
const ResponseObject = require('../helpers/responseObject');
const { UNAUTHORIZED } = require('../constants/responseStatus');

const verifyAccessToken = (req, res, next) => {
  const response = new ResponseObject();
  const bearerHeader = req.headers.authorization;
  if (typeof (bearerHeader) !== 'string') {
    response.setStatus(UNAUTHORIZED);
    response.setData({ errors: [ERRORS.TOKEN_NOT_FOUND] });
    return res.status(response.getStatus()).send(response.getData());
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
    if (err) {
      response.setStatus(UNAUTHORIZED);
      response.setData({ errors: [err] });
      return res.status(response.getStatus()).send(response.getData());
    }
    const databaseToken = await tokenModel.findOne({ accessToken: token });
    if (!databaseToken) {
      response.setStatus(UNAUTHORIZED);
      response.setData({ errors: [ERRORS.TOKEN_NOT_FOUND] });
      return res.status(response.getStatus()).send(response.getData());
    }

    const databaseUser = await userModel.findOne({ _id: result.user._id });
    if (!databaseUser) {
      response.setStatus(UNAUTHORIZED);
      response.setData({ errors: [ERRORS.USER_NOT_FOUND] });
      return res.status(response.getStatus()).send(response.getData());
    }

    req.token = databaseToken.toJSON();
    req.user = databaseUser.toJSON();
    return next();
  });
  return null;
};

const verifyRefreshToken = (req, res, next) => {
  const response = new ResponseObject();
  const bearerHeader = req.headers.authorization;
  if (typeof (bearerHeader) !== 'string') {
    response.setStatus(UNAUTHORIZED);
    response.setData({ errors: [ERRORS.TOKEN_NOT_FOUND] });
    return res.status(response.getStatus()).send(response.getData());
  }
  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
    if (err) {
      response.setStatus(UNAUTHORIZED);
      response.setData({ errors: [err] });
      return res.status(response.getStatus()).send(response.getData());
    }
    const databaseToken = await tokenModel.findOne({ refreshToken: token });
    if (!databaseToken) {
      response.setStatus(UNAUTHORIZED);
      response.setData({ errors: [ERRORS.TOKEN_NOT_FOUND] });
      return res.status(response.getStatus()).send(response.getData());
    }

    const databaseUser = await userModel.findOne({ _id: result.user._id });
    if (!databaseUser) {
      response.setStatus(UNAUTHORIZED);
      response.setData({ errors: [ERRORS.USER_NOT_FOUND] });
      return res.status(response.getStatus()).send(response.getData());
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
