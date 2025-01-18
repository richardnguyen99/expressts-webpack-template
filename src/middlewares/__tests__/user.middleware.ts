import express from "express";
import request from "supertest";

import {
  fetchUserFromSessionMiddleware,
  fetchUserMiddleware,
} from "../user.middleware";
import { User } from "../../types";
import { setupTestApp } from "../../utils/test";
import { mockedData } from "../../server";
import session from "express-session";

describe("fetchUser middleware", () => {
  let app: express.Application;

  beforeAll(async () => {
    app = express();
    setupTestApp(app);

    app.get("/", (_req, res) => {
      res.send("User: " + res.locals.user);
    });

    app.use("/:id", fetchUserMiddleware);
    app.get("/:id", async (_req, res) => {
      res.status(200).json({
        ...res.locals.user,
      });
    });

    app.post("/:id", (req, res) => {
      const user = res.locals.user as User;
      user.username = req.body.username;

      res.status(200).send(
        `User found: ${JSON.stringify({
          ...user,
        })}`,
      );
    });
  });

  it("should fetch an existing user by id", async () => {
    const testUser = (await mockedData).users[0];
    const response = await request(app).get(`/${testUser.userId}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe(
      JSON.stringify({
        ...testUser,
      }),
    );
  });

  it("should fetch an another existing user by id", async () => {
    const testUser = (await mockedData).users[1];
    const response = await request(app).get(`/${testUser.userId}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe(
      JSON.stringify({
        ...testUser,
      }),
    );
  });

  it("should return a 404 if the user is not found", async () => {
    const response = await request(app).get("/54");

    expect(response.status).toBe(404);
  });

  it("should not affect other routes without the middleware", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("User: undefined");
  });

  it("should affect other methods [POST]", async () => {
    const testUser = (await mockedData).users[0];
    const response = await request(app)
      .post(`/${testUser.userId}`)
      .send({ username: "Harry Potter" });

    expect(response.status).toBe(200);
    expect(response.text).toBe(
      `User found: ${JSON.stringify({
        ...testUser,
        username: "Harry Potter",
      })}`,
    );
  });
});

describe("fetchUserFromSession middleware", () => {
  let app: express.Application;

  beforeAll(async () => {
    app = express();
    setupTestApp(app);

    app.use(
      "/authenticated",
      session({
        secret: "testing",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
        },
      }),
      fetchUserFromSessionMiddleware,
    );

    app.get("/authenticated/session/:id", async (req, res) => {
      req.session.regenerate((err) => {
        if (err) {
          res.status(500).send("Could not regenerate session");
          return;
        }

        req.session.userId = req.params.id;
        res.status(200).send("Session updated");
      });
    });

    app.get("/authenticated/:id", (_req, res) => {
      if (!res.locals.user) {
        res.status(404).send("User not found");
        return;
      }

      res.status(200).json({
        ...res.locals.user,
      });
    });
  });

  it("should obtain a cookie and fetch a user from the cookie", async () => {
    const testUser = (await mockedData).users[0];
    const sessionResp = await request(app).get(
      `/authenticated/session/${testUser.userId}`,
    );

    expect(sessionResp.status).toBe(200);
    expect(sessionResp.text).toBe("Session updated");
    expect(sessionResp.header["set-cookie"]).toBeDefined();

    // Cookie is in the format: "connect.sid=s%3A...; Path=/; HttpOnly"
    const cookie = sessionResp.header["set-cookie"][0].split("; ")[0];

    const response = await request(app)
      .get(`/authenticated/${testUser.userId}`)
      .set("Cookie", cookie);

    expect(response.status).toBe(200);
    expect(response.text).toBe(JSON.stringify({ ...testUser }));
  });

  it("should return a 404 if the user is not found", async () => {
    const sessionResp = await request(app).get("/authenticated/session/0000");

    expect(sessionResp.status).toBe(200);
    expect(sessionResp.text).toBe("Session updated");
    expect(sessionResp.header["set-cookie"]).toBeDefined();

    // Cookie is in the format: "connect.sid=s%3A...; Path=/; HttpOnly"
    const cookie = sessionResp.header["set-cookie"][0].split("; ")[0];

    const response = await request(app)
      .get(`/authenticated/0000`)
      .set("Cookie", cookie);

    expect(response.status).toBe(404);
    expect(response.text).toBe("User not found");
  });
});
