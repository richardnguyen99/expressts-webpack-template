import type { RequestHandler } from "express";
import { getCountryDataList, getEmojiFlag } from "countries-list";
import ExpressError from "../../error";

const userProfileController: RequestHandler = async (req, res) => {
  const fetchUser = res.locals.fetchUser;

  if (!fetchUser) {
    throw new ExpressError("User not found", 404);
  }

  const countriesWithFlags = getCountryDataList().map((country) => {
    return {
      ...country,
      flag: getEmojiFlag(country.iso2),
    };
  });

  const profileData = {
    title: `User @ ${fetchUser.profile?.firstName} ${fetchUser.profile?.lastName}`,
    page: "/profile",
    countriesWithFlags,
  };

  if (req.headers["hx-request"]) {
    res.render("users/profile", {
      ...profileData,
      partial: true,
    });

    return;
  }

  res.render("users/profile", profileData);
};

export default userProfileController;
