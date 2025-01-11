import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

import { getMeta } from "../utils/meta";

const registerController: RequestHandler = (_req: Request, res: Response) => {
  const meta = Object.entries(
    getMeta({
      title: "Register | ExWt",
      description: "Register a new account",
      url: `${process.env.BASE_URL}/login`,
      "og:title": "Register | ExWt",
      "og:url": `${process.env.BASE_URL}/register`,
      "og:description": "Register a new account",
    }),
  );

  res.render("register", { title: "Register", page: "/register", meta });
};

export default registerController;
