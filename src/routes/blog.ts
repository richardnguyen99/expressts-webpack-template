import { Router } from "express";

import blogIndexController, { blogIndexRedirectMiddleware } from "../controllers/blog/home";
import blogNewController from "../controllers/blog/new";
import blogSlugController from "../controllers/blog/slug";
import {
  noCacheMiddleware,
  cachableMiddleware,
} from "../middlewares/cache.middleware";

const blogRouter: Router = Router();

blogRouter.get("/new", noCacheMiddleware, blogNewController.get);

blogRouter.post("/new", noCacheMiddleware, blogNewController.post);

blogRouter.get("/:slug", cachableMiddleware, blogSlugController);

blogRouter.get(
  "/",
  blogIndexRedirectMiddleware,
  cachableMiddleware,
  blogIndexController,
);

export default blogRouter;
