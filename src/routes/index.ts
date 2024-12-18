import { Router, type RouterOptions } from "express";

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

  appRouter.get("/", cachableMiddleware, async (_req, res) => {
    res.render("home", { page: "/", title: "Home" });
  });

  appRouter.get("/login", cachableMiddleware, loginHandler);
  appRouter.get("/register", cachableMiddleware, registerHandler);

  appRouter.use("/users", userRouter);
  appRouter.use("/blogs", blogRouter);

  return appRouter;
};

export default getAppRouter;
