import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

const blogRouter: Router = Router();

blogRouter.get("/new", (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.send("Create blog");
});

blogRouter.post("/new", (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.send("Create blog");
});

blogRouter.get("/:id", (req: Request, res: Response) => {
  res.send(`blog ${req.params.id}`);
});

export default blogRouter;
