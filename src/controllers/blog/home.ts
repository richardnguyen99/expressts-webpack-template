import { Request, Response, NextFunction } from "express-serve-static-core";

import { getTopCategories } from "../../utils/posts";
import PostService from "../../services/post.service";
import { mockedData } from "../../server";

export const blogIndexRedirectMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (Object.keys(req.query).length === 0) {
    req.url = "/blogs?category=latest";
    res.redirect(301, "/blogs?category=latest");
    return;
  }

  next();
};

const blogIndexController = async (req: Request, res: Response) => {
  const { category } = req.query;
  const data = await mockedData;
  const postService = new PostService(data);

  const posts = postService
    .query()
    .where((post) => post.category === (category as string))
    .join("author")
    .join("comments")
    .join("likes")
    .limit(10)
    .sort((posts) =>
      posts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    )
    .execute();

  const topCategories = await getTopCategories(10);
  topCategories.unshift("latest");

  res.render("blogs", {
    title: "Blogs",
    page: "/blogs",
    topCategories,
    posts,
    categoryQuery: category,
  });
};

export default blogIndexController;
