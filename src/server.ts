import * as path from "path";
import * as fs from "fs/promises";
import Express from "express";
import dotenv from "dotenv";
import methodOverride from "method-override";
import { engine as hbsEngine } from "express-handlebars";
import { getCountryDataList, getEmojiFlag, type TCountryCode } from "countries-list";

import getAppRouter from "./routes";
import morganMiddleware from "./middlewares/morgan.middleware";
import { requestIdMiddleware } from "./middlewares/request.middleware";
import errorHandlerMiddleware from "./middlewares/error.middleware";
import type { Data } from "./types";

const env_path =
  process.env.NODE_ENV === "test"
    ? ".env.test"
    : process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env";

const result = dotenv.config({
  path: path.join(__dirname, "..", env_path),
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.env.ENV_PATH = env_path;

export const mockedData: Promise<Data> = fs
  .readFile(path.join(__dirname, "fake-data.json"), "utf-8")
  .then((data) => JSON.parse(data))
  .catch(() => {
    console.error(
      "Failed to load fake data. Make sure you have run `npm run gen:data`"
    );

    process.exit(1);
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

        concat: (...args: any[]) => args.slice(0, -1).join(""),
        flag: (countryCode: TCountryCode) => getEmojiFlag(countryCode),
        countryName: (countryCode: TCountryCode) => {
          const country = getCountryDataList().find(
            (c) => c.iso2 === countryCode
          );

          return country?.name;
        },
        eq: (a: any, b: any) => a === b,
        uppercase: (str: string) => str.toUpperCase(),
        lowercase: (str: string) => str.toLowerCase(),
        capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
        len: (arr: any[]) => arr.length,
        fullname: (firstName: string, lastName: string) => `${firstName} ${lastName}`,
        isoDatetime: (timestamp: number) => {
          const date = new Date(timestamp);

          return date.toISOString();
        },
        date: (
          format: Intl.DateTimeFormatOptions["dateStyle"],
          timestamp: number
        ) => {
          const date = new Date(timestamp);

          return new Intl.DateTimeFormat("en-US", {
            dateStyle: format,
          }).format(date);
        },
      },
    })
  );
  app.set("view engine", "hbs");
  app.set("views", "src/views/pages");

  // Set up logging
  app.use(morganMiddleware);

  // Set up unique request ID registration
  app.use(requestIdMiddleware);

  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());
  app.use(methodOverride());

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

  app.use(errorHandlerMiddleware)

  return app;
};

export default createApp;
