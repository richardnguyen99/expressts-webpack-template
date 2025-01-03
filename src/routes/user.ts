import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { getCountryDataList, getEmojiFlag } from "countries-list";

import {
  fetchUserMiddleware,
  type UserRequest,
  type UserResponse,
} from "../middlewares/user.middleware";
import {
  cachableMiddleware,
  noCacheMiddleware,
} from "../middlewares/cache.middleware";
import { getPostById, getPostsByUserId } from "../utils/posts";
import { getLoggedDevicesFromUserId } from "../utils/devices";
import { getCommentsByUserId } from "../utils/comments";
import ExpressError from "../error";

const userRouter: Router = Router();

userRouter.get("/:id", (req: Request, res: Response) => {
  res.redirect(`/users/${req.params.id}/profile`);
});

userRouter.get(
  "/:id/profile",
  fetchUserMiddleware,
  noCacheMiddleware,
  (req: UserRequest, res: UserResponse) => {
    const countriesWithFlags = getCountryDataList().map((country) => {
      return {
        ...country,
        flag: getEmojiFlag(country.iso2),
      };
    });

    const profileData = {
      title: `User @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/profile",
      user: res.locals.user,
      countriesWithFlags,
    };

    if (
      req.headers["referer"] &&
      req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
    ) {
      res.render("users/profile", {
        ...profileData,
        partial: true,
      });

      return;
    }

    res.render("users/profile", profileData);
  }
);

userRouter.get(
  "/:id/devices",
  fetchUserMiddleware,
  noCacheMiddleware,
  async (req: UserRequest, res: UserResponse) => {
    const devices = await getLoggedDevicesFromUserId(req.params.id);

    const devicesData = {
      title: `Devices @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/devices",
      user: res.locals.user,
      devices,
    };

    if (
      req.headers["referer"] &&
      req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
    ) {
      res.render("users/devices", {
        ...devicesData,
        partial: true,
      });

      return;
    }

    res.render("users/devices", devicesData);
  }
);

userRouter.get(
  "/:id/notifications",
  fetchUserMiddleware,
  noCacheMiddleware,
  (req: UserRequest, res: UserResponse) => {
    const notificationData = {
      title: `Notifications @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/notifications",
      user: res.locals.user,
    };

    if (
      req.headers["referer"] &&
      req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
    ) {
      res.render("users/notifications", {
        ...notificationData,
        partial: true,
      });

      return;
    }

    res.render("users/notifications", notificationData);
  }
);

userRouter.get(
  "/:id/posts",
  fetchUserMiddleware,
  noCacheMiddleware,
  async (req: UserRequest, res: UserResponse) => {
    const posts = await getPostsByUserId(req.params.id, {
      limit: 10,
      includes: ["comments"],
    });

    const postsData = {
      title: `Posts by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/posts",
      user: res.locals.user,
      posts,
    };

    if (
      req.headers["referer"] &&
      req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
    ) {
      res.render("users/posts", {
        ...postsData,
        partial: true,
      });

      return;
    }

    res.render("users/posts", postsData);
  }
);

userRouter.get(
  "/:id/comments",
  fetchUserMiddleware,
  noCacheMiddleware,
  async (req: UserRequest, res: UserResponse) => {
    const comments = await getCommentsByUserId(req.params.id);

    const posts = await Promise.all(
      comments.map(async (comment) => {
        const post = await getPostById(comment.postId);

        if (!post) {
          throw new Error("Post not found");
        }

        return post;
      })
    );

    const commentsData = {
      title: `Comments by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/comments",
      user: res.locals.user,
      comments: comments.map((comment, index) => ({
        ...comment,
        post: posts[index],
      }))
    };

    if (
      req.headers["referer"] &&
      req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
    ) {
      res.render("users/comments", {
        ...commentsData,
        partial: true,
      });

      return;
    }

    res.render("users/comments", commentsData);
  }
);

userRouter.delete(
  "/:id/delete_account",
  fetchUserMiddleware,
  noCacheMiddleware,
  (req: UserRequest, res: UserResponse) => {
    res.send(`Delete account for user ${req.params.id}`);
  }
);

userRouter.post("/", noCacheMiddleware, (_req: Request, res: Response) => {
  res.send("Create user");
});

userRouter.put("/:id", noCacheMiddleware, (req: Request, res: Response) => {
  res.send(`Update user ${req.params.id}`);
});

userRouter.delete("/:id", noCacheMiddleware, (req: Request, res: Response) => {
  res.send(`Delete user ${req.params.id}`);
});

userRouter.get("/:id/hover-card", fetchUserMiddleware, cachableMiddleware, (req: Request, res: Response) => {
  // Check if the request contains a referer header
  if (req.headers["referer"]) {
    res.render("users/_hover_card", {
      user: res.locals.user,
    });

    return;
  }

  res.status(406).send("Not Acceptable");
});


userRouter.get("*", (_req: Request, _res: Response) => {
  const message = `The path <code>${_req.originalUrl}</code> was not found.`;

  throw new ExpressError(message, 404);
});

userRouter.use("*", (_req: Request, _res: Response) => {
  throw new ExpressError("Bad Request", 400);
});

export default userRouter;
