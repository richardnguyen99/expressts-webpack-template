import express from "express";
import request from "supertest";
import * as cheerio from "cheerio";

import { setupTestApp } from "../../../utils/test";
import blogSlugController from "../slug";
import { mockedData } from "../../../server";
import { Post } from "../../../types";
import PostService from "../../../services/post.service";

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

    //post = (await mockedData).posts[0];
    post = new PostService(await mockedData)
      .query()
      .join("author")
      .join("comments")
      .join("likes")
      .limit(1)
      .execute()[0];

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

  it("should render the comments section correctly", () => {
    const $commentSection = $(".blog__comment-section");
    expect($commentSection.length).toBe(1);

    const $heading = $commentSection.find("h2");
    expect($heading.length).toBeGreaterThan(0);
    expect($heading.eq(0).text()).toBe("Comments");

    const $comments = $commentSection.find(".blog__comments");
    expect($comments.length).toBe(1);

    const postComments = post?.comments || [];
    const $commentItems = $comments.children();

    expect($commentItems.length).toBe(postComments.length);
    $commentItems.each((index, element) => {
      const $commentItem = $(element);
      const comment = postComments[index];

      expect($commentItem.hasClass("comment-item")).toBe(true);
      expect($commentItem.attr("data-comment-id")).toBe(comment.commentId);
      expect($commentItem.attr("data-parent-url")).toBe(`/blogs/${post.slug}`);
      expect($commentItem.get(0)?.tagName).toBe("div");

      const $commentAvatar = $commentItem.find(".comment-item__avatar");
      expect($commentAvatar.length).toBe(1);
      expect($commentAvatar.get(0)?.tagName).toBe("div");

      const $commentAvatarLink = $commentAvatar.find("a");
      expect($commentAvatarLink.length).toBe(1);
      expect($commentAvatarLink.attr("href")).toBe(`/users/${comment.userId}`);
      expect($commentAvatarLink.attr("data-hover-card-url")).toBe(
        `/users/${comment.userId}/hover-card`,
      );

      const $commentAvatarImage = $commentAvatarLink.find("img");
      expect($commentAvatarImage.length).toBe(1);
      expect($commentAvatarImage.attr("src")).toBe(comment.profile?.avatar);
      expect($commentAvatarImage.attr("alt")).toBe(
        comment.profile?.firstName + " " + comment.profile?.lastName,
      );

      const $commentContent = $commentItem.find(".comment-item__content");
      expect($commentContent.length).toBe(1);

      const $commentContainer = $commentContent.find(
        ".comment-item__content__container",
      );
      expect($commentContainer.length).toBe(1);
      expect($commentContainer.attr("id")).toBe(`comment-${comment.commentId}`);

      const $commentHeader = $commentContainer.find(
        ".comment-item__content__header",
      );
      expect($commentHeader.length).toBe(1);

      const $commentAuthor = $commentHeader.find(
        ".comment-item__content__header__author",
      );
      expect($commentAuthor.length).toBe(1);
      expect($commentAuthor.get(0)?.tagName).toBe("a");
      expect($commentAuthor.attr("href")).toBe(`/users/${comment.userId}`);
      expect($commentAuthor.text()).toBe(
        comment.profile?.firstName + " " + comment.profile?.lastName,
      );

      const $commentDateContainer = $commentHeader.find(
        ".comment-item__content__header__date",
      );
      expect($commentDateContainer.length).toBe(1);

      const $commentDate = $commentDateContainer.find("span");
      expect($commentDate.text()).toBe(
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(new Date(comment.createdAt)),
      );

      const $commentTarget = $commentDateContainer.find("a");
      expect($commentTarget.length).toBe(1);
      expect($commentTarget.attr("href")).toBe(
        `/blogs/${post.slug}#comment-${comment.commentId}`,
      );
      expect($commentTarget.attr("title")).toBe(
        "Get permalink to this comment",
      );
      expect($commentTarget.find("i").hasClass("bi-hash")).toBe(true);

      const $commentContentBody = $commentContainer.find(
        ".comment-item__content__body",
      );
      expect($commentContentBody.length).toBe(1);

      const $commentParagraph = $commentContentBody.find("p");
      expect($commentParagraph.text()).toBe(comment.content);
    });
  });

  it("should render the comment form correctly", () => {
    const $commentFormSection = $(".blog__comment-form");
    expect($commentFormSection.length).toBe(1);
    expect($commentFormSection.find("h2").text()).toBe("Leave a Comment");

    const $commentForm = $commentFormSection.find("form");
    expect($commentForm.length).toBe(1);
    expect($commentForm.attr("action")).toBe(`/comments`);
    expect($commentForm.attr("method")).toBe("POST");
    expect($commentForm.children().length).toBe(2);

    const $commentFormArea = $commentForm.children().eq(0);
    expect($commentFormArea.length).toBe(1);
    expect($commentFormArea.find("textarea").length).toBe(1);

    const $commentButtonArea = $commentForm.children().eq(1);
    expect($commentButtonArea.length).toBe(1);

    const $commentButton = $commentButtonArea.find("button");
    expect($commentButton.length).toBe(1);
    expect($commentButton.text()).toBe("Submit");
    expect($commentButton.attr("type")).toBe("submit");
  });

  it("should render the extra column correctly", () => {
    const $extraColumn = $(".blog__extra");
    expect($extraColumn.length).toBe(1);
    expect($extraColumn.children().length).toBe(3);

    const $authorCard = $extraColumn.find(".blog__extra__author");
    expect($authorCard.length).toBe(1);

    const $relatedPosts = $extraColumn.find(".blog__extra__related");
    expect($relatedPosts.length).toBe(1);

    const $socials = $extraColumn.find(".blog__extra__socials");
    expect($socials.length).toBe(1);
  });

  it("should render the author card correctly", () => {
    const $authorCard = $(".blog__extra__author");
    expect($authorCard.length).toBe(1);

    const $authorBrief = $authorCard.find(".blog__extra__author__brief");
    expect($authorBrief.length).toBe(1);

    const $authorBio = $authorCard.find(".blog__extra__author__bio");
    expect($authorBio.length).toBe(1);
    expect($authorBio.find("p").text()).toBe(post.author?.profile.bio);

    const $authorAvatar = $authorBrief.find(".blog__extra__author__avatar");
    expect($authorAvatar.length).toBe(1);
    expect($authorAvatar.attr("href")).toBe(
      `/users/${post.author?.userId}/profile`,
    );

    const $authorAvatarImage = $authorAvatar.find("img");
    expect($authorAvatarImage.length).toBe(1);
    expect($authorAvatarImage.attr("src")).toBe(post.author?.profile.avatar);
    expect($authorAvatarImage.attr("alt")).toBe(
      post.author?.profile.firstName + " " + post.author?.profile.lastName,
    );

    const $authorTitle = $authorBrief.find(".blog__extra__author__title");
    expect($authorTitle.length).toBe(1);

    const $authorName = $authorTitle.find(".blog__extra__author__name");
    expect($authorName.length).toBe(1);
    expect($authorName.text()).toBe(
      post.author?.profile.firstName + " " + post.author?.profile.lastName,
    );

    const $authorJob = $authorTitle.find(".blog__extra__author__job");
    expect($authorJob.length).toBe(1);
    expect($authorJob.text()).toBe(post.author?.profile.job);
  });

  it("should render the related posts correctly", async () => {
    const relatedPosts = new PostService(await mockedData)
      .query()
      .where((p) => post.category === p.category && p.slug !== post.slug)
      .join("author")
      .limit(3)
      .execute();

    const $relatedPosts = $(".blog__extra__related");
    expect($relatedPosts.length).toBe(1);

    const $title = $relatedPosts.find("h2");
    expect($title.length).toBe(1);
    expect($title.text()).toBe("Related Posts");

    const $postList = $relatedPosts.find("ul");
    expect($postList.length).toBe(1);

    const $postItems = $postList.children();
    expect($postItems.length).toBe(relatedPosts.length);

    $postItems.each((index, element) => {
      const $postItem = $(element);
      const relatedPost = relatedPosts[index];

      expect($postItem.get(0)?.tagName).toBe("li");

      const $postLink = $postItem.find("a.article-list-short-item");
      expect($postLink.length).toBe(1);
      expect($postLink.attr("href")).toBe(`/blogs/${relatedPost.slug}`);
      expect($postLink.get(0)?.tagName).toBe("a");

      const $postThumbnail = $postLink.find(
        ".article-list-short-item__thumbnail",
      );
      expect($postThumbnail.length).toBe(1);

      const $thumbnailImage = $postThumbnail.find("img");
      expect($thumbnailImage.length).toBe(1);
      expect($thumbnailImage.attr("src")).toBe(relatedPost.thumbnail);
      expect($thumbnailImage.attr("alt")).toBe(
        `${relatedPost.title} thumbnail`,
      );
      expect($thumbnailImage.attr("width")).toBe("100%");
      expect($thumbnailImage.attr("height")).toBe("100%");

      const $postHeader = $postLink.children().eq(1);
      expect($postHeader.length).toBe(1);

      const $postHeading = $postHeader.find(
        "h6.article-list-short-item__title",
      );
      expect($postHeading.length).toBe(1);
      expect($postHeading.text()).toBe(relatedPost.title);

      const $postDate = $postHeader.find("small.article-list-short-item__date");
      expect($postDate.length).toBe(1);
      expect($postDate.text()).toBe(
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(new Date(relatedPost.createdAt)),
      );
    });
  });

  it("should return a 404 for an invalid blog post", async () => {
    expect(invalidResponse.status).toBe(404);
    expect(invalidResponse.text).toBe("Post not found");
  });
});
