import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

import { getMeta } from "../utils/meta";

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
  _req: Request,
  _res: Response,
) => {

};

const loginController = {
  get: getLoginController,
  post: postLoginController,
};

export default loginController;
