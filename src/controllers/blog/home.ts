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

  let postQuery = postService
    .query()
    .join("author")
    .join("comments")
    .join("likes");

  if (category !== "latest") {
    postQuery = postQuery.where((post) => post.category === category);
  }

  const posts = postQuery
    .limit(10)
    .sort((posts) => posts.sort((a, b) => b.createdAt - a.createdAt))
    .execute();

  const topCategories = await getTopCategories(10);
  topCategories.unshift("latest");

  const ttrs = posts.map((post) => {
    const content = post.content.replace(/<[^>]*>?/gm, "");

    return Math.ceil(content.length / 230);
  });

  res.render("blogs", {
    title: "Blogs",
    page: "/blogs",
    topCategories,
    posts: posts.map((post, index) => ({
      ...post,
      timeToRead: ttrs[index],
    })),
    categoryQuery: category,
  });
};

export default blogIndexController;
