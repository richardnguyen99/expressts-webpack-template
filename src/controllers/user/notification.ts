import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { mockedData } from "../../server";

const userNotificationController = async (
  req: UserRequest,
  res: UserResponse,
) => {
  const user = res.locals.sessionUser;

  if (!user) {
    return res.redirect(
      `/login?${new URLSearchParams(`redirect=${req.originalUrl}`).toString()}`,
    );
  }

  if (user.userId !== req.params.id) {
    return res.redirect(`/users/${res.locals.fetchUser?.userId}/profile`);
  }

  const data = await mockedData;
  const pageStr = req.query.page ? parseInt(req.query.page, 10) : 1;
  const page = isNaN(pageStr) ? 1 : pageStr;
  const perPage = 10;

  const notifications = data.notifications
    .filter((notification) => notification.recipientId === user.userId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalPages = Math.ceil(notifications.length / perPage);

  if (page > totalPages) {
    res.redirect(301, `/users/${user.userId}/activities?page=${totalPages}`);
    return;
  }

  const notificationData = {
    title: `Notifications @ ${user.profile?.firstName} ${user?.profile?.lastName}`,
    page: "/notifications",
    user,
    totalPages,
    currentPage: page > totalPages ? totalPages : page,
    notifications: notifications
      .slice((page - 1) * perPage, page * perPage)
      .map((notification) => {
        const sender = data.users.find(
          (user) => user.userId === notification.senderId,
        );

        if (notification.entityType === "post") {
          const post = data.posts.find(
            (post) => post.postId === notification.entityId,
          );

          return {
            ...notification,
            post,
            sender,
          };
        }

        return {
          ...notification,
          sender,
        };
      }),
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
