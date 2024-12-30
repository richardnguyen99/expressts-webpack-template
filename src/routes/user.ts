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

const userRouter: Router = Router();

userRouter.get("/", cachableMiddleware, (_req: Request, res: Response) => {
  res.render("users", {
    title: "Users",
    page: "/users",
  });
});

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
  (req: UserRequest, res: UserResponse) => {
    console.log(req.headers["user-agent"]);

    const devicesData = {
      title: `Devices @ ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/users",
      user: res.locals.user,
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

    res.render("users/profile", devicesData);
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
  (req: UserRequest, res: UserResponse) => {
    const postsData = {
      title: `Posts by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/posts",
      user: res.locals.user,
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
  (req: UserRequest, res: UserResponse) => {
    const commentsData = {
      title: `Comments by ${res.locals.user?.profile?.firstName} ${res.locals.user?.profile?.lastName}`,
      page: "/comments",
      user: res.locals.user,
    };

    if (
      req.headers["referer"] &&
      req.headers["referer"].includes(`/users/${res.locals.user?.userId}`)
    ) {
      res.render("users/posts", {
        ...commentsData,
        partial: true,
      });

      return;
    }

    res.render("users/posts", commentsData);
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

userRouter.get(
  "/:id/blogs",
  cachableMiddleware,
  (req: Request, res: Response) => {
    res.send(`Blogs for user ${req.params.id}`);
  }
);

export default userRouter;
