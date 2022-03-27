const ResponseObject = require('../helpers/responseObject');

const errorHandlerMiddleware = ((err, req, res, next) => {
  console.error(err);
  if (err instanceof ResponseObject) {
    return res.status(err.getStatus()).send(err.getData());
  }
  return res.status(500).send({ error: 'Unhandled error' });
});

module.exports = {
  errorHandlerMiddleware,
};
