const bcrypt = require('bcrypt');

const BaseService = require('./baseService');
const userModel = require('../models/user');
const tokenService = require('./tokenService');
const { ERRORS } = require('../constants/validation');
const { NOT_FOUND, BAD_REQUEST } = require('../constants/responseStatus');
const ApiError = require('../helpers/apiError');

class UserService extends BaseService {
  /**
   * @param userData
   * @returns {Promise<{user: *, token: *}>}
   */

  async loginUser(userData) {
    const user = await this.findOne(
      { email: userData.email },
    );

    if (!user) {
      throw new ApiError(NOT_FOUND, ERRORS.USER_NOT_FOUND);
    }

    const compareResult = await bcrypt.compare(userData.password, user.password);

    if (!compareResult) {
      throw new ApiError(BAD_REQUEST, ERRORS.WRONG_PASSWORD);
    }

    const accessToken = tokenService.createAccessToken(user.toJSON());
    const refreshToken = tokenService.createRefreshToken(user.toJSON());

    const token = await tokenService.create({ accessToken, refreshToken, user: user._id });

    return { user: user.toJSON(), token: token.toJSON() };
  }

  async logoutUser(userId, userToken) {
    await tokenService.deleteOne({ user: userId, accessToken: userToken });
  }

  async registerUser(userData) {
    const possibleUser = await this.findOne({ email: userData.email });

    if (possibleUser) {
      throw new ApiError(BAD_REQUEST, ERRORS.EMAIL_ALREADY_TAKEN);
    }

    const hashedPassword = await bcrypt.hash(userData.password, process.env.BCRYPT_SALT);

    return this.create({ ...userData, password: hashedPassword });
  }
}

module.exports = new UserService(userModel);
