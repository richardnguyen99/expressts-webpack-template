import Express from "express";
import dotenv from "dotenv";

import getAppRouter from "./routes";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const createApp = () => {
  const app = Express();

  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());

  const appRouter = getAppRouter();
  app.use(appRouter);

  return app;
};

export default createApp;
