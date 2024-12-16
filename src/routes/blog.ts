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

blogRouter.get("/:slug", (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (!slug) {
    res.status(404).send("Blog slug is required");
    return;
  }

  res.render(`blogs/${req.params.slug}`, { title: "Some blog" });
});

export default blogRouter;
