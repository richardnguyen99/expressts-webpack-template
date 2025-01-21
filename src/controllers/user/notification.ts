import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { mockedData } from "../../server";

// type Notitification = {
// id: string;
// type: "comment" | "like";
// userId: string;
// postId: string;
// createdAt: number;
// }

const userNotificationController = async (
  req: UserRequest,
  res: UserResponse,
) => {
  if (!res.locals.sessionUser) {
    return res.redirect(`/login?redirect=${req.originalUrl}`);
  }

  const data = await mockedData;
  const posts = data.posts.filter(
    (post) => post.userId === res.locals.sessionUser?.userId,
  );

  const notifications = posts.flatMap((post) => {
    const comments = data.comments.filter(
      (comment) => comment.postId === post.postId,
    );

    const likes = data.likes.filter((like) => like.postId === post.postId);

    comments.forEach((comment) => {
      comment.user = data.users.find((user) => user.userId === comment.userId);
    });

    likes.forEach((like) => {
      like.user = data.users.find((user) => user.userId === like.userId);
    });

    return [
      ...comments.map((comment) => ({
        type: "comment",
        userId: comment.userId,
        postId: comment.postId,
        createdAt: comment.createdAt,
        username: comment.user?.username,
      })),
      ...likes.map((like) => ({
        type: "like",
        userId: like.userId,
        postId: like.postId,
        createdAt: like.createdAt,
        username: like.user?.username,
      })),
    ];
  });

  const notificationData = {
    title: `Notifications @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/notifications",
    user: res.locals.sessionUser,
    notifications,
  };

  if (req.headers["hx-request"]) {
    res.render("users/notifications", {
      ...notificationData,
      partial: true,
    });

    return;
  }

  res.render("users/notifications", notificationData);
};

export default userNotificationController;
