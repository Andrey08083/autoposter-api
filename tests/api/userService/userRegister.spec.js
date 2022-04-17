const { expect } = require('chai');

const supertest = require('supertest');
const userService = require('../../../src/services/userService');
const registerUserFixture = require('../../fixtures/registerUserFixture.json');
const notValidRegisterUserFixture = require('../../fixtures/notValidRegisterUserFixture.json');
const { dropTestingDatabase } = require('../../testUtils');
const { BAD_REQUEST, OK } = require('../../../src/constants/responseStatus');
const { ERRORS } = require('../../../src/constants/validation');
const app = require('../../../src');
const { USER } = require('../../../src/constants/routes');
const { USER_STATUS } = require('../../../src/constants/userStatus');

describe('User register tests', () => {
  afterEach(async () => {
    await dropTestingDatabase();
  });

  it('should register user', async () => {
    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.REGISTRATION}`)
      .send(registerUserFixture)
      .expect(OK);

    expect(responseBody).to.have.property('email', registerUserFixture.email);
    expect(responseBody).to.have.property('userName', registerUserFixture.userName);
    expect(responseBody).to.have.property('status', USER_STATUS.INVITED);

    const user = await userService.findOne({ email: registerUserFixture.email });
    expect(user).to.have.property('id');
    expect(user).to.have.property('email', registerUserFixture.email);
    expect(user).to.have.property('userName', registerUserFixture.userName);
    expect(user).not.to.have.property('password', registerUserFixture.password);
  });

  it('should not register user if data is not valid', async () => {
    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.REGISTRATION}`)
      .send(notValidRegisterUserFixture)
      .expect(BAD_REQUEST);

    expect(responseBody).not.to.deep.eq({}); // TODO: Remap errors

    const user = await userService.findOne({ email: notValidRegisterUserFixture.email });
    expect(user).to.eq(null);
  });

  it('should not register user if that user already registered', async () => {
    await userService.registerUser(registerUserFixture);

    const { body: responseBody } = await supertest(app)
      .post(`${USER.USER_ROUTER}${USER.REGISTRATION}`)
      .send(registerUserFixture)
      .expect(BAD_REQUEST);

    expect(responseBody).to.deep.eq({ errors: [ERRORS.EMAIL_ALREADY_TAKEN] });

    const users = await userService.find({ email: registerUserFixture.email });
    expect(users).to.have.length(1);
  });
});
