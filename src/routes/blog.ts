import { Router } from "express";

import blogIndexHandler, { blogIndexRedirectMiddleware } from "./blog/home";
import blogNewHandler from "./blog/new";
import blogSlugHandler from "./blog/slug";
import {
  noCacheMiddleware,
  cachableMiddleware,
} from "../middlewares/cache.middleware";

const blogRouter: Router = Router();

blogRouter.get("/new", noCacheMiddleware, blogNewHandler.get);

blogRouter.post("/new", noCacheMiddleware, blogNewHandler.post);

blogRouter.get(
  "/:slug",
  cachableMiddleware,
  blogSlugHandler,
);

blogRouter.get(
  "/",
  blogIndexRedirectMiddleware,
  cachableMiddleware,
  blogIndexHandler,
);

export default blogRouter;
