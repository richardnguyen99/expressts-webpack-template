import { Request, Response } from "express-serve-static-core";

import { mockedData } from "../../server";
import PostService from "../../services/post.service";

const blogSlugController = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const data = await mockedData;
  const postService = new PostService(data);

  const posts = postService
    .query()
    .where((post) => post.slug === slug)
    .join("author")
    .join("comments")
    .join("likes")
    .limit(1)
    .execute();

  if (posts.length === 0) {
    res.status(404).send("Post not found");
    return;
  }

  const post = posts[0];

  const relatedPosts = new PostService(data)
    .query()
    .where((p) => post.category === p.category && p.slug !== slug)
    .limit(3)
    .execute();

  res.render(`blogs/template`, {
    post,
    relatedPosts,
  });
};

export default blogSlugController;
