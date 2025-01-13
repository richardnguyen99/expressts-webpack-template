import express from "express";
import request from "supertest";
import * as cheerio from "cheerio";

import { setupTestApp } from "../../../utils/test";
import blogIndexController from "../home";

jest.mock("../../../server", () => {
  const { fakeUsers, fakeProfiles, fakePosts, fakeComments } =
    jest.requireActual(
      "../../../utils/data",
    ) as typeof import("../../../utils/data");

  const users = fakeUsers(5);
  const profiles = fakeProfiles(users);
  const posts = fakePosts(10, users);
  const comments = fakeComments(20, users, posts);

  const generated = {
    users,
    devices: [],
    profiles,
    posts,
    comments,
  };

  return {
    __esModule: true,
    mockedData: Promise.resolve(generated),
  };
});

describe("Blog Home Controller", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    setupTestApp(app);

    app.get("/blogs", blogIndexController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if query string is missing", async () => {
    const response = await request(app).get("/blogs");

    expect(response.status).toBe(400);
  });

  it("should return a list of posts", async () => {
    const response = await request(app).get("/blogs?category=latest");

    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();

    const $ = cheerio.load(response.text);

    expect($("head > title").text()).toBe("Blogs | ExWt");
  });
});
