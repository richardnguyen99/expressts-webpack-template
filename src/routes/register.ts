import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

const registerHandler: RequestHandler = (_req: Request, res: Response) => {
  res.render("register", { title: "Register", page: "/register" });
};

export default registerHandler;
