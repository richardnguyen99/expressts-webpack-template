import { Request, Response } from "express-serve-static-core";

import { getPosts, getPostsBySlug } from "../../utils/posts";

const blogSlugHandler = async (req: Request, res: Response) => {
  const post = await getPostsBySlug(req.params.slug);

  if (post === null) {
    res.status(404).send("Post not found");
    return;
  }

  const relatedPosts = await getPosts({
    limit: 3,
    category: post.category,
    sortedBy: "views",
    order: "desc",
  });

  res.render(`blogs/template`, {
    post,
    relatedPosts,
  });
};

export default blogSlugHandler;
