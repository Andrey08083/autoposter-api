const supertest = require('supertest');
const { expect } = require('chai');

const app = require('../../../src');
const tokenService = require('../../../src/services/tokenService');
const userService = require('../../../src/services/userService');
const registerUserFixture = require('../../fixtures/registerUserFixture.json');
const { USER_STATUS } = require('../../../src/constants/userStatus');
const { dropTestingDatabase } = require('../../testUtils');
const { OK, UNAUTHORIZED } = require('../../../src/constants/responseStatus');
const { ERRORS } = require('../../../src/constants/validation');
const { USER } = require('../../../src/constants/routes');

describe('Refresh token unit tests', () => {
  let user;
  let token;
  beforeEach(async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    user = await userService.findOne();
    await userService.findOneByIdAndUpdate(user._id, { status: USER_STATUS.CONFIRMED });
    ({ token } = await userService.loginUser({ email, password }));
  });

  afterEach(async () => {
    await dropTestingDatabase();
  });

  it('should refresh token if it persists in database and return new pair of tokens', async () => {
    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.REFRESH_USER_TOKEN}`)
      .set('authorization', `Bearer ${token.refreshToken}`)
      .expect(OK);

    const updatedTokenFromDatabase = await tokenService.findOne();
    expect(responseBody).to.deep.eq(updatedTokenFromDatabase.toJSON());
  });

  it('should not refresh token if it not persists in database', async () => {
    const notDatabaseRefreshToken = tokenService.createRefreshToken(user);
    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.REFRESH_USER_TOKEN}`)
      .set('authorization', `Bearer ${notDatabaseRefreshToken}`)
      .expect(UNAUTHORIZED);

    expect(responseBody).to.deep.eq({ errors: [ERRORS.TOKEN_NOT_FOUND] });
  });
});
