import type { Request, Response } from "express-serve-static-core";

import getArchives from "../../utils/archives";
import { monthNames } from "../../utils/date";

const archiveMonthController = async (req: Request, res: Response) => {
  const { year, month: monthStr } = req.params;
  const archiveList = await getArchives();

  if (!archiveList[year]) {
    res.status(404);
    res.send("Year not found");

    return;
  }

  const month = Number(monthStr);
  if (isNaN(Number(monthStr))) {
    res.status(400);
    res.send("Invalid month");
  }

  const posts = archiveList[year].posts.filter(
    (post) => new Date(post.createdAt).getMonth() + 1 === month,
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
};

export default archiveMonthController;
