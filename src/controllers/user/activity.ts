import ExpressError from "../../error";
import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { mockedData } from "../../server";

const userCommentController = async (req: UserRequest, res: UserResponse) => {
  const user = res.locals.fetchUser;

  if (!user) {
    throw new ExpressError(`User with id=${req.params.id} not found`, 404);
  }

  const data = await mockedData;
  const pageStr = req.query.page ? parseInt(req.query.page, 10) : 1;
  const page = isNaN(pageStr) ? 1 : pageStr;
  const perPage = 10;

  const activities = data.notifications
    .filter((notification) => notification.senderId === user.userId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalPages = Math.ceil(activities.length / perPage);

  if (page > totalPages) {
    res.redirect(301, `/users/${user.userId}/activities?page=${totalPages}`);
    return;
  }

  const commentsData = {
    title: `Activities by ${user.profile?.firstName} ${user.profile?.lastName}`,
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
