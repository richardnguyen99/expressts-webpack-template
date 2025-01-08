import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";

const userHoverCardHandler = (req: UserRequest, res: UserResponse) => {
  // Check if the request contains a referer header
  if (req.headers["referer"]) {
    res.render("users/_hover_card", {
      user: res.locals.user,
    });

    return;
  }

  res.status(406).send("Not Acceptable");
};

export default userHoverCardHandler;
