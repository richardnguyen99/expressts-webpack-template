import express from "express";
import request from "supertest";

import {
  cachableMiddleware,
  noCacheMiddleware,
  cachedMiddleware,
} from "../cache.middleware";

describe("cache middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
  });

  it("should apply cache control headers for cachable responses", (done) => {
    app.get("/", cachableMiddleware, (_req, res) => {
      res.send("Hello World");
    });

    request(app)
      .get("/")
      .expect("Cache-Control", "public, max-age=0, must-revalidate")
      .expect("Content-Length", "11")
      .expect("Hello World")
      .expect(200, done);
  });

  it("should not cache non-cachable responses", (done) => {
    app.get("/", noCacheMiddleware, (_req, res) => {
      res.send("Hello World");
    });

    request(app)
      .get("/")
      .expect(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private, max-age=0",
      )
      .expect("Pragma", "no-cache")
      .expect("Expires", "-1")
      .expect("Content-Length", "11")
      .expect("Hello World")
      .expect(200, done);
  });

  it("should cache responses for static resources", (done) => {
    app.get("/", cachedMiddleware, (_req, res) => {
      res
        .header("Content-Type", "application/javascript; charset=utf-8")
        .send("console.log('Hello World')");
    });

    request(app)
      .get("/")
      .expect("Cache-Control", "public, max-age=31536000")
      .expect("Content-Length", "26")
      .expect("Content-Type", "application/javascript; charset=utf-8")
      .expect("console.log('Hello World')")
      .expect(200, done);
  });
});
