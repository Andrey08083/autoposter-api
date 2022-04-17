const supertest = require('supertest');
const { expect } = require('chai');

const app = require('../../../src');
const userService = require('../../../src/services/userService');
const tokenService = require('../../../src/services/tokenService');
const registerUserFixture = require('../../fixtures/registerUserFixture.json');
const { dropTestingDatabase } = require('../../testUtils');
const {
  BAD_REQUEST,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
} = require('../../../src/constants/responseStatus');
const { ERRORS } = require('../../../src/constants/validation');
const { USER } = require('../../../src/constants/routes');

describe('User login tests', () => {
  afterEach(async () => {
    await dropTestingDatabase();
  });

  it('should not login user if user does not exist', async () => {
    const { email, password } = registerUserFixture;

    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGIN}`)
      .send({ email, password })
      .expect(NOT_FOUND);

    expect(responseBody).to.deep.eq({ errors: [ERRORS.USER_NOT_FOUND] });
  });

  it('should not login user when user password is not correct', async () => {
    const { email } = registerUserFixture;
    await userService.registerUser(registerUserFixture);

    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGIN}`)
      .send({ email, password: 'incorrect@#123!Pass' })
      .expect(BAD_REQUEST);

    expect(responseBody).to.deep.eq({ errors: [ERRORS.WRONG_PASSWORD] });
  });

  it('should login user when user password is correct', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    const registeredUser = await userService.findOne({ email });

    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGIN}`)
      .send({ email, password })
      .expect(OK);

    const [token] = await tokenService.find();

    expect(responseBody).to.have.property('user');
    expect(responseBody).to.have.property('token');

    expect(responseBody.user).to.deep.eq(registeredUser.toJSON());

    expect(responseBody.token).to.have.property('accessToken');
    expect(responseBody.token).to.have.property('refreshToken');

    expect(responseBody.token).to.deep.eq(token.toJSON());
  });

  it('should create new token pair when user logs in', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    const registeredUser = await userService.findOne({ email });

    const { body: firstLoginResponseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGIN}`)
      .send({ email, password })
      .expect(OK);

    const [firstToken] = await tokenService.find();

    expect(firstLoginResponseBody).to.have.property('user');
    expect(firstLoginResponseBody).to.have.property('token');

    expect(firstLoginResponseBody.user).to.deep.eq(registeredUser.toJSON());

    expect(firstLoginResponseBody.token).to.have.property('accessToken');
    expect(firstLoginResponseBody.token).to.have.property('refreshToken');

    expect(firstLoginResponseBody.token).to.deep.eq(firstToken.toJSON());

    const { body: secondLoginResponseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGIN}`)
      .send({ email, password })
      .expect(OK);

    const [, secondToken] = await tokenService.find();

    expect(secondLoginResponseBody).to.have.property('user');
    expect(secondLoginResponseBody).to.have.property('token');

    expect(secondLoginResponseBody.user).to.deep.eq(registeredUser.toJSON());

    expect(secondLoginResponseBody.token).to.have.property('accessToken');
    expect(secondLoginResponseBody.token).to.have.property('refreshToken');

    expect(secondLoginResponseBody.token).to.deep.eq(secondToken.toJSON());

    const tokens = await tokenService.find();
    expect(tokens).to.have.length(2);
  });

  it('should logout user and remove it\'s token from database', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);

    await userService.loginUser({ email, password });
    await userService.loginUser({ email, password });

    const [firstToken, secondToken] = await tokenService.find();

    const { body: logoutResponseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGOUT_USER}`)
      .set('authorization', `Bearer ${secondToken.accessToken}`)
      .expect(OK);

    expect(logoutResponseBody).to.deep.eq({});

    const tokens = await tokenService.find();
    expect(tokens).to.have.length(1);

    expect(tokens[0].toJSON()).to.deep.eq(firstToken.toJSON());
  });

  it('should return error if user tries to log out with already invalid token', async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);

    await userService.loginUser({ email, password });
    await userService.loginUser({ email, password });

    const [firstToken, secondToken] = await tokenService.find();

    const { body: firstLogoutResponseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGOUT_USER}`)
      .set('authorization', `Bearer ${secondToken.accessToken}`)
      .expect(OK);

    expect(firstLogoutResponseBody).to.deep.eq({});

    const tokens = await tokenService.find();
    expect(tokens).to.have.length(1);
    expect(tokens[0].toJSON()).to.deep.eq(firstToken.toJSON());

    const { body: secondLogoutResponseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.LOGOUT_USER}`)
      .set('authorization', `Bearer ${secondToken.accessToken}`)
      .expect(UNAUTHORIZED);

    expect(secondLogoutResponseBody).to.deep.eq({ errors: [ERRORS.TOKEN_NOT_FOUND] });
  });
});
