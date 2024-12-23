import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

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

userRouter.get("/:id", noCacheMiddleware, (req: Request, res: Response) => {
  res.send(`User ${req.params.id}`);
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
