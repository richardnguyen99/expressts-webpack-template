import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

import { getMeta } from "../utils/meta";
import UserService from "../services/user.service";
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
  const { email, password, rememberMe } = req.body;

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
    return res.status(401).render("login", {
      title: "Login",
      page: "/login",
      meta,
      error: "Invalid email or password",
    });
  }

  const isValid = await userService.comparePassword(password, user.password);

  if (!isValid) {
    return res.status(401).render("login", {
      title: "Login",
      page: "/login",
      meta,
      error: "Invalid email or password",
    });
  }

  req.session.regenerate(function (err) {
    if (err) {
      return res.status(500).render("errors/5xx", {
        title: "Server Error",
        statusCode: 500,
        message: "An error occurred while logging in",
      });
    }

    req.session.userId = user.userId;
    req.session.cookie.sameSite = "lax";

    if (rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }

    req.flash(
      "success_message",
      `Welcome back, <strong>${user.username}</strong>`,
    );

    return res.redirect("/");
  });
};

const loginController = {
  get: getLoginController,
  post: postLoginController,
};

export default loginController;
