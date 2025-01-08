import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import userCommmentHandler from "./user/comment";
import userPostHandler from "./user/post";
import userNotificationHandler from "./user/notification";
import userDeviceHandler from "./user/device";
import userProfileHandler from "./user/profile";
import userHoverCardHandler from "./user/hover-card";
import {
  fetchUserMiddleware,
  type UserRequest,
  type UserResponse,
} from "../middlewares/user.middleware";
import {
  cachableMiddleware,
  noCacheMiddleware,
} from "../middlewares/cache.middleware";
import ExpressError from "../error";

const userRouter: Router = Router();

userRouter.get("/:id", (req: Request, res: Response) => {
  res.redirect(`/users/${req.params.id}/profile`);
});

userRouter.get(
  "/:id/profile",
  fetchUserMiddleware,
  noCacheMiddleware,
  userProfileHandler,
);

userRouter.get(
  "/:id/devices",
  fetchUserMiddleware,
  noCacheMiddleware,
  userDeviceHandler,
);

userRouter.get(
  "/:id/notifications",
  fetchUserMiddleware,
  noCacheMiddleware,
  userNotificationHandler,
);

userRouter.get(
  "/:id/posts",
  fetchUserMiddleware,
  noCacheMiddleware,
  userPostHandler,
);

userRouter.get(
  "/:id/comments",
  fetchUserMiddleware,
  noCacheMiddleware,
  userCommmentHandler,
);

userRouter.get(
  "/:id/hover-card",
  fetchUserMiddleware,
  cachableMiddleware,
  userHoverCardHandler,
);

userRouter.delete(
  "/:id/delete_account",
  fetchUserMiddleware,
  noCacheMiddleware,
  (req: UserRequest, res: UserResponse) => {
    res.send(`Delete account for user ${req.params.id}`);
  },
);

userRouter.post("/", noCacheMiddleware, (_req: Request, res: Response) => {
  res.send("Create user");
});

userRouter.put("/:id", noCacheMiddleware, (req: Request, res: Response) => {
  res.send(`Update user ${req.params.id}`);
});

userRouter.delete("/:id", noCacheMiddleware, (req: Request, res: Response) => {
  res.send(`Delete user ${req.params.id}`);
});

userRouter.get("*", (_req: Request) => {
  const message = `The path <code>${_req.originalUrl}</code> was not found.`;

  throw new ExpressError(message, 404);
});

userRouter.use("*", () => {
  throw new ExpressError("Bad Request", 400);
});

export default userRouter;
