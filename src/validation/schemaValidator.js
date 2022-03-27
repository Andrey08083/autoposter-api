const { defaultJoiSettings } = require('./validationSettings');
const ResponseObject = require('../helpers/responseObject');
const { BAD_REQUEST } = require('../constants/responseStatus');

module.exports = (validationSchema, body) => {
  const response = new ResponseObject();
  const validationResult = validationSchema.validate(body, defaultJoiSettings);
  if (validationResult.error) {
    response.setStatus(BAD_REQUEST);
    response.setData(validationResult.error);
    throw response;
  }
};
