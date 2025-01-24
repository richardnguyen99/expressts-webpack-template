import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";

import { ResponseLocals } from "../types";
import UserService from "../services/user.service";
import { mockedData } from "../server";

export type UserRequest = Request<
  { id: string },
  unknown,
  unknown,
  { page?: string },
  ResponseLocals
>;
export type UserResponse = Response<unknown, ResponseLocals>;

export const fetchUserMiddleware = async (
  req: UserRequest,
  res: UserResponse,
  next: NextFunction,
): Promise<void> => {
  const user = new UserService(await mockedData)
    .query()
    .where((user) => user.userId === req.params.id)
    .join("profile")
    .first();

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  const { password, ...rest } = user;
  res.locals.fetchUser = rest;

  next();
};

export const fetchUserFromSessionMiddleware = async (
  req: UserRequest,
  res: UserResponse,
  next: NextFunction,
): Promise<void> => {
  if (!req.session.userId) {
    next();
    return;
  }
  const user = new UserService(await mockedData)
    .query()
    .where((user) => user.userId === req.session.userId)
    .join("profile")
    .first();

  if (!user) {
    next();
    return;
  }

  res.locals.sessionUser = user;
  next();
};
