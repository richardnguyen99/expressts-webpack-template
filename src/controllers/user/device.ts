import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { getLoggedDevicesFromUserId } from "../../utils/devices";

const userDeviceController = async (req: UserRequest, res: UserResponse) => {
  const user = res.locals.sessionUser;

  if (!user) {
    return res.redirect(
      `/login?${new URLSearchParams(`redirect=${req.originalUrl}`).toString()}`,
    );
  }

  if (user.userId !== req.params.id) {
    return res.redirect(`/users/${res.locals.fetchUser?.userId}/profile`);
  }

  const devices = await getLoggedDevicesFromUserId(req.params.id);

  const devicesData = {
    title: `Devices @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/devices",
    user: res.locals.user,
    devices,
  };

  if (req.headers["hx-request"]) {
    res.render("users/devices", {
      ...devicesData,
      partial: true,
    });

    return;
  }

  res.render("users/devices", devicesData);
};

export default userDeviceController;
