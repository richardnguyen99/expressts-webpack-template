import * as path from "path";
import * as fs from "fs/promises";
import Express from "express";
import dotenv from "dotenv";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import bcrypt from "bcrypt";

import type { Data } from "./types";
import getAppRouter from "./routes";
import logger from "./logger";
import hbsEngine from "./engine";
import { fetchUserFromSessionMiddleware } from "./middlewares/user.middleware";
import morganMiddleware from "./middlewares/morgan.middleware";
import { requestIdMiddleware } from "./middlewares/request.middleware";
import errorHandlerMiddleware, {
  ErrorHandler,
} from "./middlewares/error.middleware";

const getErrorTemplate: ErrorHandler = (_req, res, _next) => {
  const data = {
    title: res.locals.title,
    statusCode: res.locals.statusCode,
    message: res.locals.message,
  };

  if (res.locals.statusCode >= 400 && res.locals.statusCode < 500) {
    res.render("errors/4xx", data);
    return;
  }

  res.render("errors/5xx", {
    title: res.locals.title,
    statusCode: res.locals.statusCode,
    message: res.locals.message,
  });
};

const stream = {
  write: (message: string) => {
    const messageParts = message.split(" ");

    if (Number(messageParts[messageParts.length - 5]) >= 400) {
      logger.error(message.replace(/\n$/, ""));
      return;
    }

    logger.http(message.replace(/\n$/, ""));
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "test";
};

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
  .then((data) => {
    const dataObj = JSON.parse(data) as Data;

    dataObj.users = dataObj.users.map((user) => {
      return {
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      }
    });

    return dataObj;
  })
  .catch(() => {
    console.error(
      "Failed to load fake data. Make sure you have run `npm run gen:data`",
    );

    process.exit(1);
  });

const createApp = async () => {
  const manifestContent = await fs.readFile(
    path.join(__dirname, "public", "manifest.json"),
    "utf-8",
  );
  const manifest = JSON.parse(manifestContent);

  const app = Express();
  const session: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    session.cookie!.secure = true;
  }

  // Set up handlebars as the template engine
  app.engine(
    "hbs",
    hbsEngine({
      manifest,
    }),
  );
  app.set("view engine", "hbs");
  app.set("views", "src/views/pages");

  // Set up logging
  app.use(morganMiddleware(stream, skip));

  // Set up unique request ID registration
  app.use(requestIdMiddleware);
  app.use(cookieParser());
  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());
  app.use(methodOverride());

  // Set up cookie and session
  app.use(expressSession(session));
  app.use(fetchUserFromSessionMiddleware);

  app.use(
    "/public",
    Express.static(path.join(__dirname, "public"), {
      maxAge: "30d",
      lastModified: true,
      etag: true,
      cacheControl: true,
    }),
  );

  const appRouter = getAppRouter();
  app.use(appRouter);

  app.use(errorHandlerMiddleware(getErrorTemplate));

  return app;
};

export default createApp;
