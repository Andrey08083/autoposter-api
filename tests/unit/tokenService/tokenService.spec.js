const { expect } = require('chai');
const tokenService = require('../../../src/services/tokenService');
const userService = require('../../../src/services/userService');
const registerUserFixture = require('../../fixtures/registerUserFixture.json');
const { USER_STATUS } = require('../../../src/constants/userStatus');
const { dropTestingDatabase } = require('../../testUtils');
const ResponseObject = require('../../../src/helpers/responseObject');
const { OK, BAD_REQUEST} = require('../../../src/constants/responseStatus');
const {ERRORS} = require("../../../src/constants/validation");

describe('Token service unit tests', () => {
  let user;
  let token;
  beforeEach(async () => {
    const { email, password } = registerUserFixture;
    await userService.registerUser(registerUserFixture);
    user = await userService.findOne();
    await userService.findOneByIdAndUpdate(user._id, { status: USER_STATUS.CONFIRMED });
    ({ token } = (await userService.loginUser({ email, password })).getData());
  });

  afterEach(async () => {
    await dropTestingDatabase();
  });

  it('should refresh token if it persists in database and return new pair of tokens', async () => {
    const refreshResult = await tokenService.refreshUserToken(token.refreshToken, user.toJSON());

    expect(refreshResult).to.instanceof(ResponseObject);
    expect(refreshResult.getStatus()).to.eq(OK);

    const updatedTokenFromDatabase = await tokenService.findOne();
    expect(refreshResult.getData()).to.deep.eq(updatedTokenFromDatabase.toJSON());
  });

  it('should not refresh token if it not persists in database', async () => {
    const notDatabaseRefreshToken = tokenService.createRefreshToken(user);
    const refreshResult = await tokenService
      .refreshUserToken(notDatabaseRefreshToken, user.toJSON());

    expect(refreshResult).to.instanceof(ResponseObject);
    expect(refreshResult.getStatus()).to.eq(BAD_REQUEST);
    expect(refreshResult.getData()).to.deep.eq({ errors: [ERRORS.TOKEN_NOT_FOUND] });
  });
});
