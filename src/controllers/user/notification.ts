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
    return res.redirect(`/login?redirect=${req.originalUrl}`);
  }

  const data = await mockedData;
  const notifications = data.notifications
    .filter((notification) => notification.recipientId === user.userId)
    .sort((a, b) => b.createdAt - a.createdAt);

  const notificationData = {
    title: `Notifications @ ${user.profile?.firstName} ${user?.profile?.lastName}`,
    page: "/notifications",
    user,
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
