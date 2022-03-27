const { expect } = require('chai');
const userService = require('../../../src/services/userService');
const registerUserFixture = require('../../fixtures/registerUserFixture.json');
const notValidRegisterUserFixture = require('../../fixtures/notValidRegisterUserFixture.json');
const { dropTestingDatabase } = require('../../testUtils');
const { BAD_REQUEST, OK } = require('../../../src/constants/responseStatus');
const ResponseObject = require('../../../src/helpers/responseObject');
const { ERRORS } = require('../../../src/constants/validation');

describe('User register tests', () => {
  afterEach(async () => {
    await dropTestingDatabase();
  });

  it('should register user', async () => {
    const registerResult = await userService.registerUser(registerUserFixture);

    expect(registerResult.getStatus()).to.eq(OK);
    expect(registerResult.getData()).to.deep.eq({});

    const user = await userService.findOne({ email: registerUserFixture.email });
    expect(user).to.have.property('id');
    expect(user).to.have.property('email', registerUserFixture.email);
    expect(user).to.have.property('userName', registerUserFixture.userName);
    expect(user).not.to.have.property('password', registerUserFixture.password);
  });

  it('should not register user if data is not valid', async () => {
    try {
      await userService.registerUser(notValidRegisterUserFixture);
    } catch (e) {
      expect(e).to.be.instanceof(ResponseObject);
      expect(e.getStatus()).to.eq(BAD_REQUEST);
      expect(e.getData()).not.to.deep.eq({}); // TODO: Remap errors
    }

    const user = await userService.findOne({ email: notValidRegisterUserFixture.email });
    expect(user).to.eq(null);
  });

  it('should not register user if that user already registered', async () => {
    await userService.registerUser(registerUserFixture);

    const secondRegister = await userService.registerUser(registerUserFixture);
    expect(secondRegister).to.be.instanceof(ResponseObject);
    expect(secondRegister.getData()).to.deep.eq({ errors: [ERRORS.EMAIL_ALREADY_TAKEN] });
    expect(secondRegister.getStatus()).to.eq(BAD_REQUEST);

    const users = await userService.find({ email: registerUserFixture.email });
    expect(users).to.have.length(1);
  });
});
