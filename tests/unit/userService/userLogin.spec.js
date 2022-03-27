const { expect } = require('chai');
const userService = require('../../../src/services/userService');
const tokenService = require('../../../src/services/tokenService');
const registerUserFixture = require('../../fixtures/registerUserFixture.json');
const { dropTestingDatabase } = require('../../testUtils');
const ResponseObject = require('../../../src/helpers/responseObject');
const { BAD_REQUEST, OK, NOT_FOUND } = require('../../../src/constants/responseStatus');
const { ERRORS } = require('../../../src/constants/validation');
const { USER_STATUS } = require('../../../src/constants/userStatus');

describe('User login tests', () => {
  afterEach(async () => {
    await dropTestingDatabase();
  });

  it('should not login user if user is not confirmed', async () => {
    await userService.registerUser(registerUserFixture);

    const { email, password } = registerUserFixture;
    const loginResponse = await userService.loginUser({ email, password });

    expect(loginResponse).to.be.instanceof(ResponseObject);
    expect(loginResponse.getStatus()).to.eq(BAD_REQUEST);
    expect(loginResponse.getData()).to.deep.eq({ errors: [ERRORS.USER_NOT_CONFIRMED] });
  });

  it('should not login user if user does not exist', async () => {
    const { email, password } = registerUserFixture;
    const loginResponse = await userService.loginUser({ email, password });

    expect(loginResponse).to.be.instanceof(ResponseObject);
    expect(loginResponse.getStatus()).to.eq(NOT_FOUND);
    expect(loginResponse.getData()).to.deep.eq({ errors: [ERRORS.USER_NOT_FOUND] });
  });

  it('should not login user when user is not confirmed and password is not correct', async () => {
    await userService.registerUser(registerUserFixture);
    const { email } = registerUserFixture;
    const loginResponse = await userService.loginUser({ email, password: 'incorrect@#123!Pass' });

    expect(loginResponse).to.be.instanceof(ResponseObject);
    expect(loginResponse.getStatus()).to.eq(BAD_REQUEST);
    expect(loginResponse.getData()).to.deep.eq({ errors: [ERRORS.WRONG_PASSWORD] });
  });

  it('should not login user when user is confirmed and password is not correct', async () => {
    const { email } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    const registeredUser = await userService.findOne({ email });
    await userService.findOneByIdAndUpdate(registeredUser._id, { status: USER_STATUS.CONFIRMED });

    const loginResponse = await userService.loginUser({ email, password: 'incorrect@#123!Pass' });

    expect(loginResponse).to.be.instanceof(ResponseObject);
    expect(loginResponse.getStatus()).to.eq(BAD_REQUEST);
    expect(loginResponse.getData()).to.deep.eq({ errors: [ERRORS.WRONG_PASSWORD] });
  });

  it('should login user when user is confirmed and password is correct', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    const registeredUser = await userService.findOne({ email });

    const updateResult = await userService
      .findOneByIdAndUpdate(
        registeredUser._id,
        { status: USER_STATUS.CONFIRMED },
        { new: true },
      );

    const loginResponse = await userService.loginUser({ email, password });
    const [token] = await tokenService.find();

    expect(loginResponse).to.be.instanceof(ResponseObject);
    expect(loginResponse.getStatus()).to.eq(OK);

    expect(loginResponse.getData()).to.have.property('user');
    expect(loginResponse.getData()).to.have.property('token');

    expect(loginResponse.getData().user).to.deep.eq(updateResult.toJSON());

    expect(loginResponse.getData().token).to.have.property('accessToken');
    expect(loginResponse.getData().token).to.have.property('refreshToken');

    expect(loginResponse.getData().token).to.deep.eq(token.toJSON());
  });

  it('should login user when user is confirmed and password is correct', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    const registeredUser = await userService.findOne({ email });

    const updateResult = await userService
      .findOneByIdAndUpdate(
        registeredUser._id,
        { status: USER_STATUS.CONFIRMED },
        { new: true },
      );

    const firstLoginResponse = await userService.loginUser({ email, password });
    const [firstToken] = await tokenService.find();

    expect(firstLoginResponse).to.be.instanceof(ResponseObject);
    expect(firstLoginResponse.getStatus()).to.eq(OK);

    expect(firstLoginResponse.getData()).to.have.property('user');
    expect(firstLoginResponse.getData()).to.have.property('token');

    expect(firstLoginResponse.getData().user).to.deep.eq(updateResult.toJSON());

    expect(firstLoginResponse.getData().token).to.have.property('accessToken');
    expect(firstLoginResponse.getData().token).to.have.property('refreshToken');

    expect(firstLoginResponse.getData().token).to.deep.eq(firstToken.toJSON());

    const secondLoginResponse = await userService.loginUser({ email, password });
    const [, secondToken] = await tokenService.find();

    expect(secondLoginResponse).to.be.instanceof(ResponseObject);
    expect(secondLoginResponse.getStatus()).to.eq(OK);

    expect(secondLoginResponse.getData()).to.have.property('user');
    expect(secondLoginResponse.getData()).to.have.property('token');

    expect(secondLoginResponse.getData().user).to.deep.eq(updateResult.toJSON());

    expect(secondLoginResponse.getData().token).to.have.property('accessToken');
    expect(secondLoginResponse.getData().token).to.have.property('refreshToken');

    expect(secondLoginResponse.getData().token).to.deep.eq(secondToken.toJSON());

    const tokens = await tokenService.find();
    expect(tokens).to.have.length(2);
  });

  it('should logout user and remove it\'s token from database', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    const registeredUser = await userService.findOne({ email });

    await userService
      .findOneByIdAndUpdate(
        registeredUser._id,
        { status: USER_STATUS.CONFIRMED },
      );

    await userService.loginUser({ email, password });
    await userService.loginUser({ email, password });

    const [firstToken, secondToken] = await tokenService.find();

    const logoutResult = await userService.logoutUser(secondToken.user, secondToken.accessToken);

    expect(logoutResult).to.be.instanceof(ResponseObject);
    expect(logoutResult.getStatus()).to.eq(OK);
    expect(logoutResult.getData()).to.deep.eq({});

    const tokens = await tokenService.find();
    expect(tokens).to.have.length(1);
  });

  it('should return error if user tries to log out with already invalid token', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    const registeredUser = await userService.findOne({ email });

    await userService
      .findOneByIdAndUpdate(
        registeredUser._id,
        { status: USER_STATUS.CONFIRMED },
      );

    await userService.loginUser({ email, password });
    await userService.loginUser({ email, password });

    const [, secondToken] = await tokenService.find();

    const logoutResult = await userService.logoutUser(secondToken.user, secondToken.accessToken);

    expect(logoutResult).to.be.instanceof(ResponseObject);
    expect(logoutResult.getStatus()).to.eq(OK);
    expect(logoutResult.getData()).to.deep.eq({});

    const tokens = await tokenService.find();
    expect(tokens).to.have.length(1);

    const secondLogoutResult = await userService.logoutUser(secondToken.user, secondToken.accessToken);

    expect(secondLogoutResult).to.be.instanceof(ResponseObject);
    expect(secondLogoutResult.getStatus()).to.eq(BAD_REQUEST);
    expect(secondLogoutResult.getData()).to.deep.eq({ errors: [ERRORS.ALREADY_LOGGED_OUT] });
  });
});
