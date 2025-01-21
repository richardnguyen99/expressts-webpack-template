import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { getPostsByUserId } from "../../utils/posts";

const userPostController = async (req: UserRequest, res: UserResponse) => {
  const posts = (
    await getPostsByUserId(req.params.id, {
      limit: 10,
      includes: ["comments", "likes"],
    })
  ).map((post) => ({
    ...post,
    content: post.content.split("\n")[0],
  }));

  const postsData = {
    title: `Posts by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/posts",
    posts,
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
