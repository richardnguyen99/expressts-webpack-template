import { Router, type RouterOptions } from "express";

import loginHandler from "./login";
import registerHandler from "./register";
import userRouter from "./user";
import blogRouter from "./blog";

const getAppRouter = () => {
  const routerOptions: RouterOptions = {
    mergeParams: true,
    strict: true,
    caseSensitive: true,
  };

  const appRouter = Router(routerOptions);

  appRouter.get("/", async (_req, res) => {
    res.render("home");
  });

  appRouter.get("/login", loginHandler);
  appRouter.get("/register", registerHandler);

  appRouter.use("/users", userRouter);
  appRouter.use("/blogs", blogRouter);

  return appRouter;
};

export default getAppRouter;
