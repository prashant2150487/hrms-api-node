import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal Server Error";
    err = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    ...err,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };
  console.log(next);

  res.status(statusCode).json(response);
};

export default errorHandler;
