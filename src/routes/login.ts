import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

const loginHandler: RequestHandler = (_req: Request, res: Response) => {
  res.render("login", { title: "Login", page: "/login" });
};

export default loginHandler;
