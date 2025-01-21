import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";

const userNotificationController = async (
  req: UserRequest,
  res: UserResponse,
) => {
  if (!res.locals.sessionUser) {
    return res.redirect(`/login?redirect=${req.originalUrl}`);
  }

  const notificationData = {
    title: `Notifications @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/notifications",
    user: res.locals.sessionUser,
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
