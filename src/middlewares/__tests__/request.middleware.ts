import express from "express";
import request from "supertest";

import { requestIdMiddleware } from "../request.middleware";

describe("request middleware", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(requestIdMiddleware);
  });

  it("should add a unique request id to the response headers", (done) => {
    app.get("/", (_req, res) => {
      res.send("Hello World");
    });

    request(app)
      .get("/")
      .expect("X-Request-Id", /[a-f0-9-]{36}/)
      .expect("Content-Length", "11")
      .expect("Hello World")
      .expect(200, done);
  });
});
