import type {
  Request,
  RequestHandler,
  Response,
} from "express-serve-static-core";

const registerHandler: RequestHandler = (_req: Request, res: Response) => {
  res.send("Register page\n");
};

export default registerHandler;
