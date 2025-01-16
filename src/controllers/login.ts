import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

import { getMeta } from "../utils/meta";
import UserService from "../services/user";
import { mockedData } from "../server";

interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const getLoginController: RequestHandler = (_req: Request, res: Response) => {
  const meta = Object.entries(
    getMeta({
      title: "Login | ExWt",
      description: "Login to your account",
      url: `${process.env.BASE_URL}/login`,
      "og:title": "Login | ExWt",
      "og:url": `${process.env.BASE_URL}/login`,
      "og:description": "Login to your account",
    }),
  );

  res.render("login", { title: "Login", page: "/login", meta });
};

const postLoginController: RequestHandler = async (
  req: Request<unknown, unknown, LoginDto>,
  res: Response,
) => {
  const userService = new UserService(await mockedData);
  const { email, password } = req.body;

  const meta = Object.entries(
    getMeta({
      title: "Login | ExWt",
      description: "Login to your account",
      url: `${process.env.BASE_URL}/login`,
      "og:title": "Login | ExWt",
      "og:url": `${process.env.BASE_URL}/login`,
      "og:description": "Login to your account",
    }),
  );

  const user = await userService.getUserByEmail(email);

  if (!user) {
    return res.status(400).render("login", {
      title: "Login",
      page: "/login",
      meta,
      error: "Invalid email or password",
    });
  }

  const isValid = await userService.comparePassword(password, user.password);

  if (!isValid) {
    return res.status(400).render("login", {
      title: "Login",
      page: "/login",
      meta,
      error: "Invalid email or password",
    });
  }

  req.session.userId = user.userId;
};

const loginController = {
  get: getLoginController,
  post: postLoginController,
};

export default loginController;
