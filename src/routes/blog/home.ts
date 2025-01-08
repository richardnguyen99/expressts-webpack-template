import {
  Request,
  Response,
  NextFunction
} from "express-serve-static-core";

import { getPosts, getTopCategories } from "../../utils/posts";

export const blogIndexRedirectMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.query).length === 0) {
    req.url = "/blogs?category=latest";
    res.redirect(301, "/blogs?category=latest");
    return;
  }

  next();
};

const blogIndexHandler = async (
  req: Request, res: Response
) => {
  const { category } = req.query;

  if (typeof category !== "string") {
    res.status(400).send("Invalid category");
    return;
  }

  const topCategories = await getTopCategories(10);

  const posts = await getPosts({
    category,
    limit: 10,
    sortedBy: "latest",
    order: "desc",
    includes: ["author", "comments", "timetoread"],
  });

  topCategories.unshift("latest");

  res.render("blogs", {
    title: "Blogs",
    page: "/blogs",
    topCategories,
    posts,
    categoryQuery: category,
  });
};

export default blogIndexHandler;

