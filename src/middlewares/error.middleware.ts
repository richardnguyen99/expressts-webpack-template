import {
  ErrorRequestHandler,
  ParamsDictionary,
  RequestHandler,
  Query,
} from "express-serve-static-core";
import { STATUS_CODES } from "http";

import ExpressError from "../error";

export type LocalObjs = {
  error: Error;
  title: string;
  statusCode: number;
  message: string;
};

export type ErrorHandler = RequestHandler<
  ParamsDictionary,
  unknown,
  unknown,
  Query,
  LocalObjs
>;

const errorHandler = (
  cb: ErrorHandler,
): ErrorRequestHandler<
  ParamsDictionary,
  unknown,
  unknown,
  Query,
  LocalObjs
> => {
  return (err: ExpressError, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message;

    res.locals.error = err;
    res.locals.title = STATUS_CODES[statusCode]!;
    res.locals.statusCode = statusCode;
    res.locals.message = message;
    res.status(statusCode);

    cb(req, res, next);
  };
};

export default errorHandler;
