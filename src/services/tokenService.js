const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const tokenModel = require('../models/token');
const BaseService = require('./baseService');

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
    const accessToken = this.createAccessToken(userData);
    const refreshToken = this.createRefreshToken(userData);

    const updateResult = await tokenModel.findOneAndUpdate(
      { refreshToken: oldRefreshToken },
      { accessToken, refreshToken },
      { new: true },
    );

    return updateResult.toJSON();
  };
}

module.exports = new TokenService(tokenModel);
