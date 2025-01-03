import { Router, type RouterOptions } from "express";

import {
  getTopCategories,
  getLatestArchives,
  getPosts,
} from "../utils/posts";
import { getMeta } from "../utils/meta";
import loginHandler from "./login";
import registerHandler from "./register";
import userRouter from "./user";
import blogRouter from "./blog";
import archivesRouter from "./archives";
import { cachableMiddleware } from "../middlewares/cache.middleware";

const getAppRouter = () => {
  const routerOptions: RouterOptions = {
    mergeParams: true,
    strict: true,
    caseSensitive: true,
  };

  const appRouter = Router(routerOptions);

  appRouter.get(
    "/",
    (req, res, next) => {
      if (Object.keys(req.query).length === 0) {
        req.url = "/?category=latest";
        res.redirect(301, "/?category=latest");
        return;
      }

      next();
    },
    cachableMiddleware,
    async (req, res, next) => {
      const category = req.query.category as string;

      try {
        const topThreeViewedPosts = await getPosts({
          limit: 3,
          category,
          sortedBy: "views",
          order: "desc",
        });
        const topThreeRecentPosts = await getPosts({
          limit: 3,
          category,
          sortedBy: "latest",
          order: "desc",
        });
        const topCategories = await getTopCategories(9);
        const recentArchives = await getLatestArchives(12);

        topCategories.unshift("latest");

        if (topCategories.length > 0 && !topCategories.includes(category)) {
          res.status(404);
          res.send("Category not found");

          return;
        }

        const meta = Object.entries(
          getMeta({
            title: "Home | ExWt",
            description: "ExpressTS Webpack Template",
            url: `${process.env.BASE_URL}/`,
            "og:url": `${process.env.BASE_URL}/`,
          })
        );

        res.render("home", {
          page: "/",
          title: "Home",
          env: process.env.NODE_ENV,
          meta,
          topThreeViewedPosts,
          topThreeRecentPosts,
          topCategories,
          categoryQuery: category,
          recentArchives,
        });

      } catch (error) {
        next(error);
      }
    }
  );

  appRouter.get("/login", cachableMiddleware, loginHandler);
  appRouter.get("/register", cachableMiddleware, registerHandler);

  appRouter.use("/users", userRouter);
  appRouter.use("/blogs", blogRouter);
  appRouter.use("/archives", archivesRouter);

  return appRouter;
};

export default getAppRouter;
