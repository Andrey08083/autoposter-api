class ApiError extends Error {
  statusCode;

  constructor(statusCode, ...errors) {
    super();
    this.statusCode = statusCode;
    this.errors = errors;
  }

  formatErrorObject() {
    return { errors: this.errors };
  }
}

module.exports = ApiError;
