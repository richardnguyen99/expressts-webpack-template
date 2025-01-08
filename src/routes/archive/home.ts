import type { Request, Response } from "express-serve-static-core";

import getArchives from "../../utils/archives";

const archiveHomeHandler = async (_req: Request, res: Response) => {
  const archiveList = Object.entries(await getArchives()).sort(
    (a, b) => Number(b[0]) - Number(a[0]),
  );

  archiveList.forEach(([_, { posts }]) => {
    posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  res.render("archives", {
    title: "Archives",
    page: "/archives",
    env: process.env.NODE_ENV,
    archiveList,
  });
};

export default archiveHomeHandler;
