import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { mockedData } from "../../server";
import PostService from "../../services/post.service";

const userPostController = async (req: UserRequest, res: UserResponse) => {
  const posts = new PostService(await mockedData)
    .query()
    .where((post) => post.userId === res.locals.fetchUser?.userId)
    .join("author")
    .join("comments")
    .join("likes")
    .limit(10)
    .execute();

  const postsData = {
    title: `Posts by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/posts",
    posts: posts.map((post) => ({
      ...post,
      content: post.content.split("\n")[0],
    })),
  };

  if (req.headers["hx-request"]) {
    res.render("users/posts", {
      ...postsData,
      partial: true,
    });

    return;
  }

  res.render("users/posts", postsData);
};

export default userPostController;
