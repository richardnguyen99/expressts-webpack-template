import { Router, type RouterOptions } from "express";

import { getTopViewedPosts, getRecentPosts } from "../utils/posts";
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

  appRouter.get("/", cachableMiddleware, async (_req, res, next) => {
    try {
      const topThreeViewedPosts = await getTopViewedPosts(3);
      const topFiveRecentPosts = await getRecentPosts(5);

      res.render("home", {
        page: "/",
        title: "Home",
        topThreeViewedPosts,
        topFiveRecentPosts,
      });
    } catch (error) {
      next(error);
    }
  });

  appRouter.get("/login", cachableMiddleware, loginHandler);
  appRouter.get("/register", cachableMiddleware, registerHandler);

  appRouter.use("/users", userRouter);
  appRouter.use("/blogs", blogRouter);

  return appRouter;
};

export default getAppRouter;
