import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

import { getMeta } from "../utils/meta";

const loginController: RequestHandler = (_req: Request, res: Response) => {
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

export default loginController;
