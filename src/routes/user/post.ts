import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import {  getPostsByUserId } from "../../utils/posts";

const userPostHandler = async (req: UserRequest, res: UserResponse) => {
  const posts = await getPostsByUserId(req.params.id, {
    limit: 10,
    includes: ["comments"],
  });

  const postsData = {
    title: `Posts by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/posts",
    user: res.locals.user,
    posts,
  };

  if (
    req.headers["referer"] &&
    req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
  ) {
    res.render("users/posts", {
      ...postsData,
      partial: true,
    });

    return;
  }

  res.render("users/posts", postsData);
};

export default userPostHandler;
