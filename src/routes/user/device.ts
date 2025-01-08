import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";
import { getLoggedDevicesFromUserId } from "../../utils/devices";

const userDeviceHandler = async (req: UserRequest, res: UserResponse) => {
  const devices = await getLoggedDevicesFromUserId(req.params.id);

  const devicesData = {
    title: `Devices @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/devices",
    user: res.locals.user,
    devices,
  };

  if (
    req.headers["referer"] &&
    req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
  ) {
    res.render("users/devices", {
      ...devicesData,
      partial: true,
    });

    return;
  }

  res.render("users/devices", devicesData);
};

export default userDeviceHandler;
