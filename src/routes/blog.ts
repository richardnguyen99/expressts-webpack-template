import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import {
  noCacheMiddleware,
  cachableMiddleware,
} from "../middlewares/cache.middleware";
import { getPosts, getPostsBySlug, getTopCategories } from "../utils/posts";

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

    if (post === null) {
      res.status(404).send("Post not found");
      return;
    }

    const relatedPosts = await getPosts({
      limit: 3,
      category: post.category,
      sortedBy: "views",
      order: "desc",
    });

    res.render(`blogs/template`, {
      post,
      relatedPosts,
    });
  }
);

blogRouter.get(
  "/",
  (req, res, next) => {
    if (Object.keys(req.query).length === 0) {
      req.url = "/blogs?category=latest";
      res.redirect(301, "/blogs?category=latest");
      return;
    }

    next();
  },
  cachableMiddleware,
  async (req: Request, res: Response) => {
    const { category } = req.query;

    if (typeof category !== "string") {
      res.status(400).send("Invalid category");
      return;
    }

    const topCategories = await getTopCategories(10);

    const posts = await getPosts({
      category,
      limit: 10,
      sortedBy: "latest",
      order: "desc",
      includes: ["author", "comments", "timetoread"],
    });

    topCategories.unshift("latest");

    res.render("blogs", {
      title: "Blogs",
      page: "/blogs",
      topCategories,
      posts,
      categoryQuery: category,
    });
  }
);

export default blogRouter;
