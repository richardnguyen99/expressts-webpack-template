import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import {
  noCacheMiddleware,
  cachableMiddleware,
} from "../middlewares/cache-middleware";

const blogRouter: Router = Router();

blogRouter.get("/new", noCacheMiddleware, (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.render("blogs/new", { title: "New blog" });
});

blogRouter.post("/new", noCacheMiddleware, (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.send("Create blog");
});

blogRouter.get("/:slug", noCacheMiddleware, (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (!slug) {
    res.status(404).send("Blog slug is required");
    return;
  }

  res.render(`blogs/${req.params.slug}`, { title: "Some blog" });
});

blogRouter.get("/", cachableMiddleware, (_req: Request, res: Response) => {
  res.render("blogs", { title: "Blogs", page: "/blogs" });
});

export default blogRouter;
