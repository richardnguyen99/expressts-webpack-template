import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

const loginHandler: RequestHandler = (_req: Request, res: Response) => {
  res.send("login page\n");
};

export default loginHandler;
