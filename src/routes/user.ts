import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

const userRouter: Router = Router();

userRouter.get("/", (_req: Request, res: Response) => {
  res.send("List of users");
});

userRouter.get("/:id", (req: Request, res: Response) => {
  res.send(`User ${req.params.id}`);
});

userRouter.post("/", (_req: Request, res: Response) => {
  res.send("Create user");
});

userRouter.put("/:id", (req: Request, res: Response) => {
  res.send(`Update user ${req.params.id}`);
});

userRouter.delete("/:id", (req: Request, res: Response) => {
  res.send(`Delete user ${req.params.id}`);
});

userRouter.get("/:id/blogs", (req: Request, res: Response) => {
  res.send(`Blogs for user ${req.params.id}`);
});

export default userRouter;
