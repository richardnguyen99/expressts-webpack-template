import { mockedData } from "../server";
import { Post } from "../types";

import { getCommmentsByPostId } from "./comments";
import { getUserById } from "./users";

type Options = {
  limit: number;
  category: string;
  sortedBy: "latest" | "views" | "likes";
  order: "asc" | "desc";
  includes?: ("author" | "comments" | "timetoread")[];
};

const createdAtLessThanStrategy = (a: Post, b: Post) =>
  a.createdAt - b.createdAt;
const createdAtGreaterThanStrategy = (a: Post, b: Post) =>
  b.createdAt - a.createdAt;

const createdAtStragies = {
  asc: createdAtLessThanStrategy,
  desc: createdAtGreaterThanStrategy,
};

const getPostsByLatest = (posts: Post[], order: "asc" | "desc") => {
  return posts.sort((a, b) => createdAtStragies[order](a, b));
};

const viewsLessThanStrategy = (a: Post, b: Post) => b.views - a.views;
const viewsGreaterThanStrategy = (a: Post, b: Post) => a.views - b.views;

const viewsStrategies = {
  asc: viewsLessThanStrategy,
  desc: viewsGreaterThanStrategy,
};

const getPostsByViews = (posts: Post[], order: "asc" | "desc") => {
  return posts.sort((a, b) => viewsStrategies[order](a, b));
};

const likesLessThanStrategy = (a: Post, b: Post) => b.likes - a.likes;
const likesGreaterThanStrategy = (a: Post, b: Post) => a.likes - b.likes;

const likesStrategies = {
  asc: likesLessThanStrategy,
  desc: likesGreaterThanStrategy,
};

const getPostsByLikes = (posts: Post[], order: "asc" | "desc") => {
  return posts.sort((a, b) => likesStrategies[order](a, b));
};

const categoryFilter = (posts: Post[], category: string) => {
  return posts.filter((post) => post.category === category);
};

const postSortStrategies = {
  latest: getPostsByLatest,
  views: getPostsByViews,
  likes: getPostsByLikes,
};

const includesAuthorStrategy = (posts: Post[]) => {
  posts.forEach(async (post) => {
    const author = await getUserById(post.userId, {
      includes: ["profile"],
    });

    post.author = {
      userId: author!.userId,
      profile: author!.profile!,
    };
  });
};

const includesCommentsStrategy = async (posts: Post[]) => {
  posts.forEach(async (post) => {
    const comments = await getCommmentsByPostId(post.postId, {
      limit: -1,
      includes: ["author"],
    });

    post.comments = comments;
  });
};

export const getPosts = async (options: {
  limit: number;
  category: string;
  sortedBy: "latest" | "views" | "likes";
  order: "asc" | "desc";
  includes?: ("author" | "comments" | "timetoread")[];
}): Promise<Post[]> => {
  const { limit, category, sortedBy, order, includes } = options;

  const data = await mockedData;
  const posts = data.posts;

  const filteredPosts =
    category === "latest" ? posts : categoryFilter(posts, category);

  const sortedPosts = postSortStrategies[sortedBy](filteredPosts, order);

  if (includes && includes.includes("author")) {
    const authors = sortedPosts.map((post) => {
      return data.users.find((user) => user.userId === post.userId);
    });

    const authorProfiles = authors.map((author) => {
      return data.profiles.find((profile) => profile.userId === author!.userId);
    });

    sortedPosts.forEach((post, index) => {
      post.author = {
        userId: authors[index]!.userId,
        profile: authorProfiles[index]!,
      };
    });
  }

  if (includes && includes.includes("comments")) {
    const comments = sortedPosts.map((post) => {
      return data.comments.filter((comment) => comment.postId === post.postId);
    });

    sortedPosts.forEach((post, index) => {
      const postComments = comments[index];

      postComments.forEach((comment) => {
        const author = data.users.find(
          (user) => user.userId === comment.userId,
        );
        const profile = data.profiles.find(
          (profile) => profile.userId === author!.userId,
        );

        comment.author = {
          userId: author!.userId,
          profile: profile!,
        };
      });

      post.comments = comments[index];
    });
  }

  if (includes && includes.includes("timetoread")) {
    sortedPosts.forEach((post) => {
      const words = post.content.split(" ").length;
      post.timeToRead = Math.ceil(words / 200);
    });
  }

  return sortedPosts.slice(0, limit);
};

export const getTopViewedPosts = async (limit: number) => {
  const data = await mockedData;
  const posts = data.posts.sort((a, b) => b.views - a.views).slice(0, limit);

  return posts;
};

export const getTopLikedPosts = async (limit: number) => {
  const data = await mockedData;
  const posts = data.posts.sort((a, b) => b.likes - a.likes).slice(0, limit);

  return posts;
};

export const getRecentPosts = async (limit: number) => {
  const data = await mockedData;
  const posts = data.posts
    .sort((a, b) => b.createdAt - a.createdAt || b.views - a.views)
    .slice(0, limit);

  return posts;
};

export const getPostById = async (postId: string) => {
  const data = await mockedData;
  const post = data.posts.find((post) => post.postId === postId);

  return post;
};

export const getPostsByUserId = async (
  userId: string,
  options?: Partial<Omit<Options, "category">>,
): Promise<Post[]> => {
  const data = await mockedData;
  const posts = data.posts.filter((post) => post.userId === userId);

  if (!options) {
    return posts;
  }

  const limit: number = options.limit
    ? options.limit < 0
      ? posts.length
      : options.limit
    : posts.length;

  const sortedBy: Options["sortedBy"] = options.sortedBy || "latest";
  const order: Options["order"] = options.order || "desc";

  const sortedPosts = postSortStrategies[sortedBy](posts, order);

  if (options.includes && options.includes.includes("author")) {
    includesAuthorStrategy(sortedPosts);
  }

  if (options.includes && options.includes.includes("comments")) {
    includesCommentsStrategy(sortedPosts);
  }

  return posts.slice(0, limit);
};

export const getPostsBySlug = async (slug: string) => {
  const data = await mockedData;
  const post = data.posts.find((post) => post.slug === slug);

  if (!post) {
    return null;
  }

  const author = data.users.find((user) => user.userId === post!.userId);
  const profile = data.profiles.find(
    (profile) => profile.userId === author!.userId,
  );
  const comments = await getCommmentsByPostId(post.postId, {
    limit: -1,
    includes: ["author"],
  });

  post.author = {
    userId: author!.userId,
    profile: profile!,
  };

  post.comments = comments;

  return post;
};

export const getTopCategories = async (count: number) => {
  const data = await mockedData;
  const posts = data.posts;

  const categories = posts.reduce(
    (acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = 1;
      } else {
        acc[post.category] += 1;
      }

      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategories = Object.keys(categories)
    .sort((a, b) => categories[b] - categories[a])
    .slice(0, count);

  return topCategories;
};

export const getArchives = async () => {
  const data = await mockedData;
  const posts = data.posts;

  const archives = posts.reduce(
    (acc, post) => {
      const date = new Date(post.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][month]) {
        acc[year][month] = 1;
      } else {
        acc[year][month] += 1;
      }

      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

  return archives;
};

export const getLatestArchives = async (limit: number) => {
  const data = await mockedData;
  const posts = data.posts;

  const archives = posts.reduce(
    (acc, post) => {
      const date = new Date(post.createdAt);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "long" });

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][month]) {
        acc[year][month] = 1;
      } else {
        acc[year][month] += 1;
      }

      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

  const latestArchives = Object.keys(archives)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => {
      const months = Object.keys(archives[year]);
      return months
        .sort((a, b) => Number(b) - Number(a))
        .map((month) => [`${month}, ${year}`, archives[year][month]]);
    })
    .flat()
    .slice(0, limit);

  return latestArchives;
};
