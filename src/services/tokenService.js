const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const tokenModel = require('../models/token');
const BaseService = require('./baseService');
const ResponseObject = require('../helpers/responseObject');
const { BAD_REQUEST } = require('../constants/responseStatus');
const {ERRORS} = require("../constants/validation");

class TokenService extends BaseService {
  createToken(user, timeToLive) {
    return jwt.sign({
      user,
      createdAt: Date.now(),
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: timeToLive,
    });
  }

  generateConfirmationCode() {
    return crypto.randomBytes(30).toString('hex');
  }

  createAccessToken(user) {
    return this.createToken(user, '1h');
  }

  createRefreshToken(user) {
    return this.createToken(user, '30d');
  }

  refreshUserToken = async (oldRefreshToken, userData) => {
    const response = new ResponseObject();
    const accessToken = this.createAccessToken(userData);
    const refreshToken = this.createRefreshToken(userData);

    const updateResult = await tokenModel.findOneAndUpdate(
      { refreshToken: oldRefreshToken },
      { accessToken, refreshToken },
      { new: true },
    );

    if (!updateResult) {
      response.setStatus(BAD_REQUEST);
      response.setData({ errors: [ERRORS.TOKEN_NOT_FOUND] });
      return response;
    }

    response.setData(updateResult.toJSON());
    return response;
  };
}

module.exports = new TokenService(tokenModel);
