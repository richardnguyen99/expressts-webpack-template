import type { RequestHandler } from "express";
import { getCountryDataList, getEmojiFlag } from "countries-list";
import ExpressError from "../../error";

const userProfileController: RequestHandler = async (req, res) => {
  const fetchUser = res.locals.fetchUser;

  if (!fetchUser) {
    throw new ExpressError("User not found", 404);
  }

  console.log(fetchUser); // For debugging

  const countriesWithFlags = getCountryDataList().map((country) => {
    return {
      ...country,
      flag: getEmojiFlag(country.iso2),
    };
  });

  const profileData = {
    title: `User @ ${fetchUser.profile?.firstName} ${fetchUser.profile?.lastName}`,
    page: "/profile",
    user: fetchUser,
    countriesWithFlags,
  };

  if (
    req.headers["referer"] &&
    req.headers["referer"].includes(`/users/${fetchUser.userId}`)
  ) {
    res.render("users/profile", {
      ...profileData,
      partial: true,
    });

    return;
  }

  res.render("users/profile", profileData);
};

export default userProfileController;
