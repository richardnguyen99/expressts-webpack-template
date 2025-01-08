import {
  NextFunction
} from "express-serve-static-core";

import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { getPostById } from "../../utils/posts";
import { getCommentsByUserId } from "../../utils/comments";

const userCommentHandler = async (req: UserRequest, res: UserResponse, _next: NextFunction) => {
  const comments = await getCommentsByUserId(req.params.id);

  const posts = await Promise.all(
    comments.map(async (comment) => {
      const post = await getPostById(comment.postId);

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    })
  );

  const commentsData = {
    title: `Comments by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/comments",
    user: res.locals.user,
    comments: comments.map((comment, index) => ({
      ...comment,
      post: posts[index],
    }))
  };

  if (
    req.headers["referer"] &&
    req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
  ) {
    res.render("users/comments", {
      ...commentsData,
      partial: true,
    });

    return;
  }

  res.render("users/comments", commentsData);
};

export default userCommentHandler;
