import { Router } from "express";

import { cachableMiddleware } from "../middlewares/cache.middleware";
import archiveHomeHandler from "./archive/home";
import archiveYearHandler from "./archive/year";
import archiveMonthHandler from "./archive/month";

const archivesRouter: Router = Router();

archivesRouter.get("/", cachableMiddleware, archiveHomeHandler);
archivesRouter.get("/:year", cachableMiddleware, archiveYearHandler);
archivesRouter.get("/:year/:month", cachableMiddleware, archiveMonthHandler);

export default archivesRouter;
