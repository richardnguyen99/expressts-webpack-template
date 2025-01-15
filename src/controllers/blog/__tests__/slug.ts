import express from "express";
import request from "supertest";
import * as cheerio from "cheerio";

import { setupTestApp } from "../../../utils/test";
import blogSlugController from "../slug";
import { mockedData } from "../../../server";
import { Post } from "../../../types";

describe("Blog Slug Controller", () => {
  let app: express.Application;
  let post: Post;
  let response: request.Response;
  let invalidResponse: request.Response;
  let $: cheerio.CheerioAPI;

  beforeAll(async () => {
    app = express();
    setupTestApp(app);

    app.get("/blogs/:slug", blogSlugController);

    post = (await mockedData).posts[0];
    response = await request(app).get(`/blogs/${post.slug}`);
    invalidResponse = await request(app).get(`/blogs/invalid-slug`);

    $ = cheerio.load(response.text);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a valid blog post", async () => {
    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();
    expect($("head > title").text()).toBe(`${post.title} | ExWt`);
  });

  it("should render the breadcrumb items correctly", async () => {
    const $breadcrumb = $(".breadcrumb");
    expect($breadcrumb.length).toBe(1);
    expect($breadcrumb.get(0)).toBeTruthy();
    expect($breadcrumb.get(0)!.tagName).toBe("ol");

    const $breadcrumbItems = $breadcrumb.find("li");
    expect($breadcrumbItems.length).toBe(3);

    const $homeBreadcrumb = $breadcrumbItems.eq(0);
    const $homeBreadcrumbLink = $homeBreadcrumb.find("a");
    expect($homeBreadcrumbLink.text()).toBe("Home");
    expect($homeBreadcrumbLink.attr("href")).toBe("/");

    const $blogsBreadcrumb = $breadcrumbItems.eq(1);
    const $blogsBreadcrumbLink = $blogsBreadcrumb.find("a");
    expect($blogsBreadcrumbLink.text()).toBe("Blogs");

    const $currentBreadcrumb = $breadcrumbItems.eq(2);
    expect($currentBreadcrumb.text()).toBe(post.slug);
    expect($currentBreadcrumb.hasClass("active")).toBe(true);
    expect($currentBreadcrumb.attr("aria-current")).toBe("page");
  });

  it("should render the title section correctly", () => {
    const $title = $(".blog__content__title");
    expect($title.length).toBe(1);
    expect($title.text()).toBe(post.title);
    expect($title.get(0)?.tagName).toBe("h1");
  });

  it("should render the timeline section correctly", () => {
    const $info = $(".blog__content__info");
    expect($info.length).toBe(1);

    const $timeline = $(".blog__content__info__timeline");
    expect($timeline.length).toBe(1);

    const $avatar = $timeline.find("a.blog__content__info__avatar");
    expect($avatar.length).toBe(1);
    expect($avatar.attr("href")).toBe(`/users/${post.author?.userId}/profile`);

    const $avatarImage = $avatar.find("img");
    expect($avatarImage.length).toBe(1);
    expect($avatarImage.attr("src")).toBe(post.author?.profile.avatar);
    expect($avatarImage.attr("alt")).toBe(
      post.author?.profile.firstName + " " + post.author?.profile.lastName,
    );

    const $author = $timeline.find(".blog__content__info__author");
    expect($author.length).toBe(1);
    expect($author.text()).toBe(
      post.author?.profile.firstName + " " + post.author?.profile.lastName,
    );

    const $date = $timeline.find(".blog__content__info__date");
    const expectedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(new Date(post.createdAt));
    expect($date.length).toBe(1);
    expect($date.text()).toBe(expectedDate);
  });

  it("should render the metadata section correctly", () => {
    const $info = $(".blog__content__info");
    expect($info.length).toBe(1);

    const $metadata = $(".blog__content__info__metadata");
    expect($metadata.length).toBe(1);

    const $category = $metadata.find(
      ".blog__content__info__metadata__category",
    );
    expect($category.length).toBe(1);
    expect($category.get(0)!.tagName).toBe("div");
    expect($category.text().toLowerCase()).toBe(post.category);

    const $views = $metadata.find(".blog__content__info__metadata__views");
    expect($views.length).toBe(1);
    expect($views.get(0)!.tagName).toBe("div");
    expect($views.find("i").hasClass("bi-eye")).toBe(true);
    expect($views.find("span").text()).toBe(post.views.toString());

    const $likes = $metadata.find(".blog__content__info__metadata__likes");
    expect($likes.length).toBe(1);
    expect($likes.get(0)!.tagName).toBe("div");
    expect($likes.find("i").hasClass("bi-heart")).toBe(true);
    expect($likes.find("span").text()).toBe(post.likes?.length.toString());

    const $comments = $metadata.find(
      ".blog__content__info__metadata__comments",
    );
    expect($comments.length).toBe(1);
    expect($comments.get(0)!.tagName).toBe("div");
    expect($comments.find("i").hasClass("bi-chat")).toBe(true);
    expect($comments.find("span").text()).toBe(
      post.comments?.length.toString(),
    );
  });

  it("should render the thumbnail correctly", () => {
    const $thumbnail = $(".blog__content__thumbnail");
    expect($thumbnail.length).toBe(1);

    const $thumbnailImage = $thumbnail.find("img");
    expect($thumbnailImage.length).toBe(1);

    expect($thumbnailImage.attr("src")).toBe(post.thumbnail);
    expect($thumbnailImage.attr("alt")).toBe(`${post.title} thumbnail`);
  });

  it("should render the blog content correctly", () => {
    const $body = $(".blog__content__body");
    expect($body.length).toBe(1);

    const $paragraphs = $body.find("p");
    expect($paragraphs.length).toBe(post.content.split("\n").length);

    const postContent = post.content.split("\n");
    $paragraphs.each((index, element) => {
      expect(`<p>${$(element).text()}</p>`).toBe(postContent[index]);
    });
  });

  it("should return a 404 for an invalid blog post", async () => {
    expect(invalidResponse.status).toBe(404);
    expect(invalidResponse.text).toBe("Post not found");
  });
});
