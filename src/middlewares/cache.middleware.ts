import type { RequestHandler } from "express-serve-static-core";

const noCacheMiddleware: RequestHandler = (_req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private, max-age=0",
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "-1");

  next();
};

const cachableMiddleware: RequestHandler = (_req, res, next) => {
  res.set("Cache-Control", "public, max-age=0, must-revalidate");

  next();
};

const cachedMiddleware: RequestHandler = (_req, res, next) => {
  res.set("Cache-Control", "public, max-age=31536000");
  res.set("Expires", new Date(Date.now() + 31536000000).toUTCString());

  next();
};

export { noCacheMiddleware, cachableMiddleware, cachedMiddleware };
