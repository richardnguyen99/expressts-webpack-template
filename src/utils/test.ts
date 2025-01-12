import Express from "express";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";

import hbsEngine from "../engine";

export const setupTestApp = (app: Express.Application) => {
  app.engine(
    "hbs",
    hbsEngine({
      manifest: {},
    }),
  );
  app.set("view engine", "hbs");
  app.set("views", "src/views/pages");

  app.use(cookieParser());
  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());
  app.use(methodOverride());
};
