import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express-serve-static-core";

/**
 * Middleware to add a unique request id to the response headers to identify the
 * request in the logs.
 *
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const requestIdMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("X-Request-Id", uuidv4());
  next();
};
