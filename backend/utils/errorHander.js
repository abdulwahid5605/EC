// first word of class is always capital
// ErrorHander is extended class of Error(a built in node class)
class ErrorHander extends Error {
  constructor(statuscode, message) {
    this.statuscode = statuscode;
    this.message = message;
    // where this is an object below
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHander;
