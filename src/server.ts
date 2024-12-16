import * as path from "path";
import Express from "express";
import dotenv from "dotenv";
import { engine as hbsEngine } from "express-handlebars";

import getAppRouter from "./routes";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const createApp = async () => {
  const app = Express();

  // Set up handlebars as the template engine
  app.engine(
    "hbs",
    hbsEngine({
      partialsDir: [path.join(__dirname, "views", "partials")],
      extname: "hbs",
      defaultLayout: path.join(
        __dirname,
        "views",
        "partials",
        "layouts",
        "main.hbs"
      ),
      layoutsDir: path.join(__dirname, "views", "partials", "layouts"),
    })
  );
  app.set("view engine", "hbs");
  app.set("views", "src/views/pages");

  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());

  const appRouter = getAppRouter();
  app.use(appRouter);

  return app;
};

export default createApp;
