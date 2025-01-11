import { Router } from "express";

import { cachableMiddleware } from "../middlewares/cache.middleware";
import archiveHomeController from "../controllers/archive/home";
import archiveYearController from "../controllers/archive/year";
import archiveMonthController from "../controllers/archive/month";

const archivesRouter: Router = Router();

archivesRouter.get("/", cachableMiddleware, archiveHomeController);
archivesRouter.get("/:year", cachableMiddleware, archiveYearController);
archivesRouter.get("/:year/:month", cachableMiddleware, archiveMonthController);

export default archivesRouter;
