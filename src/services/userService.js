const bcrypt = require('bcrypt');

const BaseService = require('./baseService');
const userModel = require('../models/user');
const tokenService = require('./tokenService');
const { USER_STATUS } = require('../constants/userStatus');
const { ERRORS } = require('../constants/validation');
const ResponseObject = require('../helpers/responseObject');
const { NOT_FOUND, BAD_REQUEST } = require('../constants/responseStatus');
const { userLoginSchema, userRegisterSchema } = require('../validation/userSchema');
const schemaValidator = require('../validation/schemaValidator');

class UserService extends BaseService {
  /**
   * @param userData
   * @returns {Promise<ResponseObject>}
   */

  async loginUser(userData) {
    schemaValidator(userLoginSchema, userData);
    const response = new ResponseObject();

    const user = await this.findOne(
      { email: userData.email },
      { resetPasswordToken: 0, confirmationCode: 0 },
    );

    if (!user) {
      response.setStatus(NOT_FOUND);
      response.setData({ errors: [ERRORS.USER_NOT_FOUND] });
      return response;
    }

    const compareResult = await bcrypt.compare(userData.password, user.password);

    if (!compareResult) {
      response.setStatus(BAD_REQUEST);
      response.setData({ errors: [ERRORS.WRONG_PASSWORD] });
      return response;
    }

    if (user.status !== USER_STATUS.CONFIRMED) {
      response.setStatus(BAD_REQUEST);
      response.setData({ errors: [ERRORS.USER_NOT_CONFIRMED] });
      return response;
    }

    const accessToken = tokenService.createAccessToken(user.toJSON());
    const refreshToken = tokenService.createRefreshToken(user.toJSON());

    const token = await tokenService.create({ accessToken, refreshToken, user: user._id });

    response.setData({ user: user.toJSON(), token: token.toJSON() });
    return response;
  }

  async logoutUser(userId, userToken) {
    const response = new ResponseObject();
    const logoutResult = await tokenService.deleteOne({ user: userId, accessToken: userToken });

    if (!logoutResult.deletedCount) {
      response.setStatus(BAD_REQUEST);
      response.setData({ errors: [ERRORS.ALREADY_LOGGED_OUT] });
    }
    return response;
  }

  async registerUser(userData) {
    schemaValidator(userRegisterSchema, userData);
    const response = new ResponseObject();

    const possibleUser = await this.findOne({ email: userData.email });

    if (possibleUser) {
      response.setStatus(BAD_REQUEST);
      response.setData({ errors: [ERRORS.EMAIL_ALREADY_TAKEN] });
      return response;
    }

    const hashedPassword = await bcrypt.hash(userData.password, process.env.BCRYPT_SALT);

    await this.create({ ...userData, password: hashedPassword });

    return response;
  }
}

module.exports = new UserService(userModel);
