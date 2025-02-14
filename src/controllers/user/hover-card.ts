import {
  type UserRequest,
  type UserResponse,
} from "../../middlewares/user.middleware";

const userHoverCardController = (req: UserRequest, res: UserResponse) => {
  // Check if the request contains a referer header
  if (req.headers["referer"]) {
    res.render("users/_hover_card");

    return;
  }

  res.status(406).send("Not Acceptable");
};

export default userHoverCardController;
