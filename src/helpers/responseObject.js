const { OK } = require('../constants/responseStatus');

class ResponseObject {
  constructor() {
    this.data = {};
    this.status = OK;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}

module.exports = ResponseObject;
