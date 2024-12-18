import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import {
  noCacheMiddleware,
  cachableMiddleware,
} from "../middlewares/cache-middleware";
import { getPostsBySlug } from "../utils/posts";

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

blogRouter.get(
  "/:slug",
  cachableMiddleware,
  async (req: Request, res: Response) => {
    const post = await getPostsBySlug(req.params.slug);

    if (!post) {
      res.status(404).send("Post not found");
      return;
    }

    res.render(`blog`, { post });
  }
);

blogRouter.get("/", cachableMiddleware, (_req: Request, res: Response) => {
  res.render("blogs", { title: "Blogs", page: "/blogs" });
});

export default blogRouter;
