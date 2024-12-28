import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import { getUserById } from "../utils/users";

import {
  cachableMiddleware,
  noCacheMiddleware,
} from "../middlewares/cache.middleware";

const userRouter: Router = Router();

userRouter.get("/", cachableMiddleware, (_req: Request, res: Response) => {
  res.render("users", {
    title: "Users",
    page: "/users",
  });
});

userRouter.get("/:id", noCacheMiddleware, async (req: Request, res: Response) => {

  const user = await getUserById(req.params.id, {
    includes: ["posts", "profile"],
  });

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.render("users/template", {
    title: `${user.profile!.firstName} ${user.profile!.lastName}`,
    page: "/users",
    user,
  })
});

userRouter.post("/", noCacheMiddleware, (_req: Request, res: Response) => {
  res.send("Create user");
});

userRouter.put("/:id", noCacheMiddleware, (req: Request, res: Response) => {
  res.send(`Update user ${req.params.id}`);
});

userRouter.delete("/:id", noCacheMiddleware, (req: Request, res: Response) => {
  res.send(`Delete user ${req.params.id}`);
});

userRouter.get(
  "/:id/blogs",
  cachableMiddleware,
  (req: Request, res: Response) => {
    res.send(`Blogs for user ${req.params.id}`);
  }
);

export default userRouter;
