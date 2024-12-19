import { Router, type RouterOptions } from "express";

import {
  getTopViewedPosts,
  getRecentPosts,
  getTopCategories,
} from "../utils/posts";
import loginHandler from "./login";
import registerHandler from "./register";
import userRouter from "./user";
import blogRouter from "./blog";
import { cachableMiddleware } from "../middlewares/cache-middleware";

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
        const topThreeViewedPosts = await getTopViewedPosts(3);
        const topFiveRecentPosts = await getRecentPosts(5);
        const topCategories = await getTopCategories(9);
        topCategories.unshift("latest");

        if (topCategories.length > 0 && !topCategories.includes(category)) {
          res.status(404);
          res.send("Category not found");

          return;
        }

        res.render("home", {
          page: "/",
          title: "Home",
          topThreeViewedPosts,
          topFiveRecentPosts,
          topCategories,
          categoryQuery: category,
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

  return appRouter;
};

export default getAppRouter;
