import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import { monthNames } from "../utils/date";
import getArchives from "../utils/archives";

const archivesRouter: Router = Router();

archivesRouter.get("/", async (_req: Request, res: Response) => {
  const archiveList = Object.entries(await getArchives())
    .sort((a, b) => Number(b[0]) - Number(a[0]))


    archiveList.forEach(([_, { posts }]) => {
      posts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

  res.render("archives", {
    title: "Archives",
    page: "/archives",
    env: process.env.NODE_ENV,
    archiveList,
  });
});

archivesRouter.get("/:year", async (req: Request, res: Response) => {
  const { year } = req.params;
  const archiveList = await getArchives();

  if (!archiveList[year]) {
    res.status(404);
    res.send("Year not found");

    return;
  }

  const posts = archiveList[year].posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.render("archive", {
    title: `Archives ${year}`,
    page: "/archives",
    env: process.env.NODE_ENV,
    year,
    posts,
  });
});

archivesRouter.get("/:year/:month", async (req: Request, res: Response) => {
  const { year, month: monthStr  } = req.params;
  const archiveList = await getArchives();

  if (!archiveList[year]) {
    res.status(404);
    res.send("Year not found");

    return;
  }

  let month = Number(monthStr);
  if (isNaN(Number(monthStr))) {
    res.status(400);
    res.send("Invalid month");
  }

  const posts = archiveList[year].posts.filter(
    (post) =>
      new Date(post.createdAt).getMonth() + 1 === month
  );

  if (posts.length === 0) {
    res.status(404);
    res.send("Month not found");

    return;
  }

  res.render("archive", {
    title: `Archives ${year}/${month}`,
    page: "/archives",
    env: process.env.NODE_ENV,
    year,
    month: monthNames[month - 1],
    posts,
  });
});

export default archivesRouter;
