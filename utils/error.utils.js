class AppError extends Error {
  

  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor); //    Error.captureStackTrace() is a method in Node.js used to capture and customize the stack trace of an Error object
  }
}

export default AppError;
