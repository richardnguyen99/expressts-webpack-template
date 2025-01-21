import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import userActivityController from "../controllers/user/activity";
import userPostController from "../controllers/user/post";
import userNotificationController from "../controllers/user/notification";
import userDeviceController from "../controllers/user/device";
import userProfileController from "../controllers/user/profile";
import userHoverCardController from "../controllers/user/hover-card";
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
  userProfileController,
);

userRouter.get(
  "/:id/devices",
  fetchUserMiddleware,
  noCacheMiddleware,
  userDeviceController,
);

userRouter.get(
  "/:id/notifications",
  fetchUserMiddleware,
  noCacheMiddleware,
  userNotificationController,
);

userRouter.get(
  "/:id/posts",
  fetchUserMiddleware,
  noCacheMiddleware,
  userPostController,
);

userRouter.get(
  "/:id/activities",
  fetchUserMiddleware,
  noCacheMiddleware,
  userActivityController,
);

userRouter.get(
  "/:id/hover-card",
  fetchUserMiddleware,
  cachableMiddleware,
  userHoverCardController,
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
