import * as path from "path";
import * as fs from "fs/promises";
import Express from "express";
import dotenv from "dotenv";
import { engine as hbsEngine } from "express-handlebars";

import getAppRouter from "./routes";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const createApp = async () => {
  const manifestContent = await fs.readFile(
    path.join(__dirname, "public", "manifest.json"),
    "utf-8"
  );
  const manifest = JSON.parse(manifestContent);

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
      helpers: {
        manifest(assetPath: string) {
          if (manifest[assetPath]) {
            return manifest[assetPath];
          }

          console.error(`Asset not found in manifest: ${assetPath}`);
        },
      },
    })
  );
  app.set("view engine", "hbs");
  app.set("views", "src/views/pages");

  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());

  app.use(
    "/public",
    Express.static(path.join(__dirname, "public"), {
      maxAge: "30d",
      lastModified: true,
      etag: true,
      cacheControl: true,
    })
  );

  const appRouter = getAppRouter();
  app.use(appRouter);

  return app;
};

export default createApp;
