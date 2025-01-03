import { ErrorRequestHandler } from "express-serve-static-core";
import { STATUS_CODES } from "http";

import ExpressError from "../error";

const getErrorTemplate = (statusCode: number) => {
  if (statusCode >= 400 && statusCode < 500) {
    return "errors/4xx";
  }

  return "errors/5xx";
}

const errorHandler: ErrorRequestHandler = (err: ExpressError, _req, res, _next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).render(getErrorTemplate(statusCode), {
    title: STATUS_CODES[statusCode],
    statusCode,
    message,
  });
}

export default errorHandler;
