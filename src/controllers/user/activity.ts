import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { mockedData } from "../../server";

const userCommentController = async (req: UserRequest, res: UserResponse) => {
  const data = await mockedData;
  const pageStr = req.query.page ? parseInt(req.query.page, 10) : 1;
  const page = isNaN(pageStr) ? 1 : pageStr;
  const perPage = 10;

  const activities = data.notifications
    .filter(
      (notification) =>
        notification.recipientId === res.locals.fetchUser?.userId,
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalPages = Math.ceil(activities.length / perPage);

  if (page > totalPages) {
    res.redirect(
      301,
      `/users/${res.locals.fetchUser?.userId}/activities?page=${totalPages}`,
    );
    return;
  }

  const commentsData = {
    title: `Activities by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/activities",
    user: res.locals.user,
    totalPages,
    currentPage: page > totalPages ? totalPages : page,
    activities: activities
      .slice((page - 1) * perPage, page * perPage)
      .map((activity) => {
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
