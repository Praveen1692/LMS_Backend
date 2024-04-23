const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // default status code if not found in the error object
  err.message = err.message || "Something Wrong"; //  default message if no message is provided by the error
 return res.status(err.statusCode).json({
    success: false, //   a flag to indicate that everything went well or not
    message: err.message, //    the actual error message which will be sent back to the client side
    stack: err.stack, //   the complete stack trace of the error for debugging purposes
  });
};


export default errorMiddleware;