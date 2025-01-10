import express from "express";
import request from "supertest";

import { fetchUserMiddleware } from "../user.middleware";

jest.mock("../../utils/users", () => {
  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
    },
    {
      id: "2",
      name: "Jane Doe",
    },
    {
      id: "3",
      name: "Alice",
    },
  ];

  return {
    getUserById: jest.fn(async (id: string) => {
      return mockUsers.find((user) => user.id === id);
    }),
  };
});

describe("user middleware", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.get("/", (_req, res) => {
      res.send("User: " + res.locals.user);
    });

    app.use("/:id", fetchUserMiddleware);
    app.get("/:id", (_req, res) => {
      res.status(200).send(`User found: ${JSON.stringify(res.locals.user)}`);
    });

    app.post("/:id", (req, res) => {
      const json = req.body;

      res.status(200).send(
        `User found: ${JSON.stringify({
          id: req.params.id,
          name: json.name,
          oldName: res.locals.user.name,
        })}`,
      );
    });
  });

  it("should fetch an existing user by id = 1", async () => {
    const response = await request(app).get("/1");

    expect(response.status).toBe(200);
    expect(response.text).toBe(
      `User found: ${JSON.stringify({ id: "1", name: "John Doe" })}`,
    );
  });

  it("should fetch an existing user by id = 2", async () => {
    const response = await request(app).get("/2");

    expect(response.status).toBe(200);
    expect(response.text).toBe(
      `User found: ${JSON.stringify({ id: "2", name: "Jane Doe" })}`,
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
    const response = await request(app)
      .post("/1")
      .send({ name: "Harry Potter" });

    expect(response.status).toBe(200);
    expect(response.text).toBe(
      `User found: ${JSON.stringify({
        id: "1",
        name: "Harry Potter",
        oldName: "John Doe",
      })}`,
    );
  });
});
