import { Request, Response } from "express-serve-static-core";

const blogNewGetHandler = async (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.render("blogs/new", { title: "New blog" });
};

const blogNewPostHandler = async (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.send("Create blog");
};

const blogNewHandler = {
  get: blogNewGetHandler,
  post: blogNewPostHandler,
};

export default blogNewHandler;
