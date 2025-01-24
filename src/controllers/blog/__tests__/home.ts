import express from "express";
import request from "supertest";
import * as cheerio from "cheerio";

import { setupTestApp } from "../../../utils/test";
import blogIndexController, { blogIndexRedirectMiddleware } from "../home";
import { getTopCategories } from "../../../utils/posts";
import PostService from "../../../services/post.service";
import { mockedData } from "../../../server";

describe("Blog Home Controller", () => {
  let app: express.Application;
  let postService: PostService;

  beforeAll(async () => {
    app = express();
    setupTestApp(app);

    postService = new PostService(await mockedData);

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
    const posts = postService
      .query()
      .where((post) => post.category === "latest")
      .join("author")
      .join("comments")
      .sort((posts) =>
        posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      )
      .limit(10)
      .execute();

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
      expect($likes.find("span").text()).toBe(
        posts[index].likes?.length.toString(),
      );

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

  it("should return a list of posts for a specific category", async () => {
    const response = await request(app).get("/blogs?category=sports");

    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();

    const $ = cheerio.load(response.text);
    const topCategories = await getTopCategories(10);
    topCategories.unshift("latest");

    expect($("head > title").text()).toBe("Blogs | ExWt");

    const $offcanvasActiveItem = $(".blog__offcanvas-link[aria-current]");
    expect($offcanvasActiveItem.length).toBe(1);
    expect($offcanvasActiveItem.find("p").text().toLowerCase()).toBe("sports");

    const $blogItems = $(".article-list-blog-item");

    $blogItems.each((_index, element) => {
      expect($(element).attr("data-test-category")).toBe("sports");
    });
  });
});
