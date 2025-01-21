import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { mockedData } from "../../server";

const userCommentController = async (req: UserRequest, res: UserResponse) => {
  const data = await mockedData;

  const activities = data.notifications
    .filter(
      (notification) =>
        notification.recipientId === res.locals.fetchUser?.userId,
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  const commentsData = {
    title: `Activities by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/activities",
    user: res.locals.user,
    activities: activities.map((activity) => {
      if (activity.entityType === "post") {
        const post = data.posts.find(
          (post) => post.postId === activity.entityId,
        );

        return {
          ...activity,
          post,
        };
      }

      return activity;
    }),
  };

  if (req.headers["hx-request"]) {
    res.render("users/activity", {
      ...commentsData,
      partial: true,
    });

    return;
  }

  res.render("users/activity", commentsData);
};

export default userCommentController;
