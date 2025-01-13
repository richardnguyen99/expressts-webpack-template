import express from "express";
import request from "supertest";
import * as cheerio from "cheerio";

import { setupTestApp } from "../../../utils/test";
import blogIndexController, { blogIndexRedirectMiddleware } from "../home";
import { getPosts, getTopCategories } from "../../../utils/posts";

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

    app.get("/blogs", blogIndexRedirectMiddleware, blogIndexController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a redirect to latest when query is missing", async () => {
    const response = await request(app).get("/blogs");

    expect(response.status).toBe(301);
    expect(response.header.location).toBe("/blogs?category=latest");
  });

  it("should return a list of posts", async () => {
    const response = await request(app).get("/blogs?category=latest");

    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();

    const $ = cheerio.load(response.text);
    const posts = await getPosts({
      category: "latest",
      limit: 10,
      sortedBy: "latest",
      order: "desc",
      includes: ["author", "comments", "timetoread"],
    });
    const topCategories = await getTopCategories(10);
    topCategories.unshift("latest");

    expect($("head > title").text()).toBe("Blogs | ExWt");

    const $offcanvasItems = $(".blog__offcanvas-item");
    expect($offcanvasItems.length).toBe(topCategories.length);

    $offcanvasItems.each((index, element) => {
      const $navItem = $(element).find("a.blog__offcanvas-link");
      expect($navItem.attr("href")).toBe(
        `/blogs?category=${topCategories[index]}`,
      );
      expect($navItem.find("p").text().toLowerCase()).toBe(
        topCategories[index],
      );
    });

    const $blogItems = $(".article-list-blog-item");
    expect($blogItems.length).toBe(posts.length);

    $blogItems.each((index, element) => {
      expect($(element).attr("data-test-article-id")).toBe(posts[index].postId);
      expect($(element).attr("data-test-author-id")).toBe(
        posts[index].author?.userId,
      );
      expect($(element).attr("data-test-slug")).toBe(
        `/blogs/${posts[index].slug}`,
      );
      expect($(element).attr("data-test-category")).toBe(posts[index].category);

      expect(
        $(element).find(".article-list-blog-item__title > h2").text(),
      ).toBe(posts[index].title);
      expect(new Date($(element).find("time").attr("datetime")!)).toEqual(
        new Date(posts[index].createdAt),
      );

      const $categoryItem = $(element).find(
        ".article-list-blog-item__category > a",
      );
      expect($categoryItem.text().toLowerCase()).toBe(posts[index].category);
      expect($categoryItem.attr("href")).toBe(
        `/blogs?category=${posts[index].category}`,
      );

      const $title = $(element).find(".article-list-blog-item__title");
      expect($title.attr("href")).toBe(`/blogs/${posts[index].slug}`);
      expect($title.find("h2").text()).toBe(posts[index].title);

      const $creditSection = $(element).find(".article-list-blog-item__credit");
      const $avatar = $creditSection.find(".article-list-blog-item__avatar");
      const $credit = $creditSection.find(".article-list-blog-item__author");
      expect($avatar.find("img").attr("src")).toBe(
        posts[index].author?.profile.avatar,
      );
      expect($credit.find("a").text()).toBe(
        posts[index].author?.profile.firstName +
          " " +
          posts[index].author?.profile.lastName,
      );

      const $metadata = $(element).find(".article-list-blog-item__metadata");

      const $views = $metadata.find(".article-list-blog-item__views");
      expect($views.find("i").hasClass("bi-eye")).toBe(true);
      expect($views.find("span").text()).toBe(posts[index].views.toString());

      const $likes = $metadata.find(".article-list-blog-item__likes");
      expect($likes.find("i").hasClass("bi-heart")).toBe(true);
      expect($likes.find("span").text()).toBe(posts[index].likes.toString());

      const $comments = $metadata.find(".article-list-blog-item__comments");
      expect($comments.find("i").hasClass("bi-chat")).toBe(true);
      expect($comments.find("span").text()).toBe(
        posts[index].comments?.length.toString(),
      );

      const $ttr = $metadata.find(".article-list-blog-item__time-to-read");
      expect($ttr.find("i").hasClass("bi-clock")).toBe(true);
      expect($ttr.find("span").text()).toBe(
        posts[index].timeToRead?.toString() + " min read",
      );
    });
  });
});
