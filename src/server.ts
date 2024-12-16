import Express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const createApp = () => {
  const app = Express();

  app.use(Express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.send("Hello World!\n");
  });

  return app;
};

export default createApp;
