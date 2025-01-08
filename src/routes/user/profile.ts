import { getCountryDataList, getEmojiFlag } from "countries-list";

import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";

const userProfileHandler = async (req: UserRequest, res: UserResponse) => {
  const countriesWithFlags = getCountryDataList().map((country) => {
    return {
      ...country,
      flag: getEmojiFlag(country.iso2),
    };
  });

  const profileData = {
    title: `User @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
    page: "/profile",
    user: res.locals.user,
    countriesWithFlags,
  };

  if (
    req.headers["referer"] &&
    req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
  ) {
    res.render("users/profile", {
      ...profileData,
      partial: true,
    });

    return;
  }

  res.render("users/profile", profileData);
};

export default userProfileHandler;
