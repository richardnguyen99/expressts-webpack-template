import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";

import { getUserById } from "../utils/users";
import { ResponseLocals } from "../types";

export type UserRequest = Request<
  { id: string },
  unknown,
  unknown,
  unknown,
  ResponseLocals
>;
export type UserResponse = Response<unknown, ResponseLocals>;

export const fetchUserMiddleware = async (
  req: UserRequest,
  res: UserResponse,
  next: NextFunction,
): Promise<void> => {
  const user = await getUserById(req.params.id, {
    includes: ["profile", "posts", "comments", "likes", "devices"],
  });

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
  const user = await getUserById(req.session.userId);

  if (!user) {
    next();
    return;
  }

  res.locals.sessionUser = user;
  next();
};
