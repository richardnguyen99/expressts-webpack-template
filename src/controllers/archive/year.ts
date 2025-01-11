import type { Request, Response } from "express-serve-static-core";

import getArchives from "../../utils/archives";

const archiveYearController = async (req: Request, res: Response) => {
  const { year } = req.params;
  const archiveList = await getArchives();

  if (!archiveList[year]) {
    res.status(404);
    res.send("Year not found");

    return;
  }

  const posts = archiveList[year].posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  res.render("archive", {
    title: `Archives ${year}`,
    page: "/archives",
    env: process.env.NODE_ENV,
    year,
    posts,
  });
};

export default archiveYearController;
