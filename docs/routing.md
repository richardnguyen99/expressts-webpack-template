# Routing

This documentation tempts to describe the routing implementation of the project.

## Overview

Routing is the process of determining the way in which an application responds
to a client request to a particular endpoint using a particular HTTP method. In
other words, routing is how the application decides what code to use to render
appropriate content to the user based on the requests.

## Main router

The main router is the entry point of the routing process. It is responsible for
routing the requests that start with the `/` prefix. The main router is defined
and implemented in the [`src/routes/index.js`](https://github.com/richardnguyen99/expressts-webpack-template/blob/main/src/routes/index.ts)
file.

```ts
import { Router, type RouterOptions } from "express";

const getAppRouter = () => {
  const routerOptions: RouterOptions = {
    mergeParams: true,
    strict: true,
    caseSensitive: true,
  };

  const appRouter = Router(routerOptions);

  // route handlers

  return appRouter;
};
```

In the main app file, the app router is mounted to the Express app instance.

```ts
import Express from "express";
import getAppRouter from "./routes";

const createApp = async () => {
  const app = Express();

  // app configurations and settings

  const appRouter = getAppRouter();
  app.use(appRouter);

  return app;
};

export default createApp;
```

With this setting, the main router is responsible for routing and handling all
the requests that start with the `/` prefix. If a request is made to a resource
that does no exist in the main router, the main router is also responsible for
returning a 404 status code, or other appropriate status code, unless a sub-
router that matches with the suffix of the request path also has an error
handler.

## Sub-routers

Sub-routers are the routers that are mounted to the main router. They are
responsible for routing the requests that start with a specific prefix. Sub-
routers are defined and implemented in the [`src/routes`](https://github.com/richardnguyen99/expressts-webpack-template/tree/main/src/routes).

```txt
src/routes
├── blog.ts
├── index.ts
└── user.ts
```

Each file, except `index.ts`, defines a sub-router that is responsible for the
next prefix of the request path. For example, the `blog.ts` file defines a sub-
router that is responsible for routing the requests that start with the
`/blogs`.

```ts
import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

const blogRouter: Router = Router();

blogRouter.get("/new", (req: Request, res: Response) => {
  // route handler implementation
});

blogRouter.post("/new", (req: Request, res: Response) => {
  // route handler implementation
});

blogRouter.get("/:slug", async (req: Request, res: Response) => {
  // route handler implementation
});

blogRouter.get("/", (req: Request, res: Response) => {
  // route handler implementation
});

// Other route handlers

export default blogRouter;
```

Unlike the main router, which is mountedd directly to the Express app instance,
sub-routers are mounted to the main router with the appropriate prefix.

```diff
import { Router, type RouterOptions } from "express";

+ import blogRouter from "./blog";

const getAppRouter = () => {
  const routerOptions: RouterOptions = {
    mergeParams: true,
    strict: true,
    caseSensitive: true,
  };

  const appRouter = Router(routerOptions);

+ appRouter.use("/blogs", blogRouter);

  // route handlers

  return appRouter;
};
```

With this setting, the sub-router is responsible for routing and handling all
the requests that start with the `/blogs` prefix.

## Route handlers

Route handlers are ExpressJS-specific callback functions that are responsible
for handling the requests that are matched with the router. Route handlers are
defined and implemented in the router files.

### Route handler methods

Route handlers are defined with the appropriate HTTP method functions of the
router instance. For example, the `get` method is used to define a route handler
for the `GET` requests.

```diff ts
blogRouter.get("/new", (req: Request, res: Response) => {
-  // route handler implementation
+ res.render("blogs/new");
});
```

Or for the `POST` requests.

```diff ts
blogRouter.post("/new", (req: Request, res: Response) => {
-  // route handler implementation
+ // logic implementation
+ res.redirect("/blogs");
});
```

### Dynamic routes

Dynamic routes are routes that are defined with the parameters, which allows
the route handlers to access the parameters and retrieve the appropriate
resource based on the parameters.

```diff
blogRouter.get("/:slug", async (req: Request, res: Response) => {
- // route handler implementation
+ const { slug } = req.params;
+ const blog = await Blog.findOne({ slug });
+ // other logic implementation

+ res.render("blogs/show", { blog });
});
```

### Middlewares

A route can have a chain of callbacks to handle each stage of the request
separately. The final callback in the chain is the route handler that sends the
response. Those intermmediate callbacks are usually called middlewares.

```diff
- blogRouter.get("/:slug", async (req: Request, res: Response) => {
+ blogRouter.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
+   const { slug } = req.params;
+   if (!slug)
+     return res.status(404).send("Not Found");
+
+   next();
+ },
+ // other middlewares
+ async (req: Request, res: Response) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug });
  // other logic implementation

  res.render("blogs/show", { blog });
});
```
