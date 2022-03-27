const supertest = require('supertest');
const { expect } = require('chai');
const { dropTestingDatabase } = require('../../testUtils');
const tokenService = require('../../../src/services/tokenService');
const app = require('../../../src');
const userService = require('../../../src/services/userService');
const registerUserFixture = require('../../fixtures/registerUserFixture.json');
const { UNAUTHORIZED, OK } = require('../../../src/constants/responseStatus');
const { TOKEN } = require('../../../src/constants/routes');
const { ERRORS } = require('../../../src/constants/validation');

describe('Access token middleware API tests', () => {
  let user;

  beforeEach(async () => {
    await userService.registerUser(registerUserFixture);
    user = await userService.findOne();
  });

  afterEach(async () => {
    await dropTestingDatabase();
  });

  it('should reject when access token is expired', async () => {
    const accessToken = tokenService.createToken(user.toJSON(), 0);
    const { body: responseBody } = await supertest(app)
      .post(`${TOKEN.TOKEN_ROUTER}${TOKEN.ACCESS_TOKEN}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(UNAUTHORIZED);

    expect(responseBody).to.have.property('errors');
    expect(responseBody.errors).to.be.length(1);
    expect(responseBody.errors[0].name).to.eq('TokenExpiredError');
    expect(responseBody.errors[0].message).to.eq('jwt expired');
  });

  it('should reject when access token is malformed', async () => {
    const accessToken = tokenService.createToken(user.toJSON(), '1h');
    const { body: responseBody } = await supertest(app)
      .post(`${TOKEN.TOKEN_ROUTER}${TOKEN.ACCESS_TOKEN}`)
      .set('authorization', `Bearer ${accessToken.repeat(2)}`)
      .expect(UNAUTHORIZED);

    expect(responseBody).to.have.property('errors');
    expect(responseBody.errors).to.be.length(1);
    expect(responseBody.errors[0].name).to.eq('JsonWebTokenError');
    expect(responseBody.errors[0].message).to.eq('jwt malformed');
  });

  it('should reject when access token is not expired but not present in database', async () => {
    const accessToken = tokenService.createToken(user.toJSON(), '1h');
    const { body: responseBody } = await supertest(app)
      .post(`${TOKEN.TOKEN_ROUTER}${TOKEN.ACCESS_TOKEN}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(UNAUTHORIZED);

    expect(responseBody).to.deep.eq({ errors: [ERRORS.TOKEN_NOT_FOUND] });
  });

  it('should reject when header with token are not provided', async () => {
    const { body: responseBody } = await supertest(app)
      .post(`${TOKEN.TOKEN_ROUTER}${TOKEN.ACCESS_TOKEN}`)
      .expect(UNAUTHORIZED);

    expect(responseBody).to.deep.eq({ errors: [ERRORS.TOKEN_NOT_FOUND] });
  });

  it('should reject when access token is not expired and present in database but user with which it associates does not exist in database', async () => {
    await userService.deleteOne({ _id: user._id });
    const accessToken = tokenService.createAccessToken(user.toJSON());
    const refreshToken = tokenService.createRefreshToken(user.toJSON());
    await tokenService.create({ user: user._id, accessToken, refreshToken });

    const { body: responseBody } = await supertest(app)
      .post(`${TOKEN.TOKEN_ROUTER}${TOKEN.ACCESS_TOKEN}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(UNAUTHORIZED);

    expect(responseBody).to.deep.eq({ errors: [ERRORS.USER_NOT_FOUND] });
  });

  it('should not reject when access token is not expired and present in database and user with which is associates also exists', async () => {
    const accessToken = tokenService.createAccessToken(user.toJSON());
    const refreshToken = tokenService.createRefreshToken(user.toJSON());
    const databaseToken = await tokenService.create({ user: user._id, accessToken, refreshToken });

    const { body: responseBody } = await supertest(app)
      .post(`${TOKEN.TOKEN_ROUTER}${TOKEN.ACCESS_TOKEN}`)
      .set('authorization', `Bearer ${accessToken}`)
      .expect(OK);

    expect(responseBody).to.have.property('user');
    expect(responseBody).to.have.property('token');

    expect(responseBody.user).to.deep.eq(user.toJSON());
    expect(responseBody.token).to.deep.eq(databaseToken.toJSON());
  });
});
