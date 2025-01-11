import { Request, Response } from "express-serve-static-core";

const blogNewGetController = async (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.render("blogs/new", { title: "New blog" });
};

const blogNewPostController = async (req: Request, res: Response) => {
  const userId = req.query.userId;

  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }

  res.send("Create blog");
};

const blogNewController = {
  get: blogNewGetController,
  post: blogNewPostController,
};

export default blogNewController;
