import { mockedData } from "../server";
import type { Post, User, Comment } from "../types";

const createdAtLessThanStrategy = (a: User, b: User) =>
  a.createdAt - b.createdAt;

const createdAtGreaterThanStrategy = (a: User, b: User) =>
  b.createdAt - a.createdAt;

const createdAtStrategies = {
  asc: createdAtLessThanStrategy,
  desc: createdAtGreaterThanStrategy,
};

const getUsersWithCreatedAtOrder = (users: User[], order: "asc" | "desc") => {
  return users.sort((a, b) => createdAtStrategies[order](a, b));
};

const numberOfPostsLessThanStrategy = (aPosts: Post[], bPosts: Post[]) => {
  return aPosts.length - bPosts.length;
};

const numberOfPostsGreaterThanStrategy = (aPosts: Post[], bPosts: Post[]) => {
  return bPosts.length - aPosts.length;
};

const numberOfPostsStrategies = {
  asc: numberOfPostsLessThanStrategy,
  desc: numberOfPostsGreaterThanStrategy,
};

const getUsersWithNumberOfPostsOrder = async (
  users: User[],
  order: "asc" | "desc",
) => {
  const data = await mockedData;

  const usersWithPosts = users.map((user) => {
    const posts = data.posts.filter((post) => post.userId === user.userId);
    return { ...user, posts };
  });

  return usersWithPosts.sort((a, b) =>
    numberOfPostsStrategies[order](a.posts, b.posts),
  ) as User[];
};

const numberOfCommentsLessThanStrategy = (
  aComments: Comment[],
  bComments: Comment[],
) => {
  return aComments.length - bComments.length;
};

const numberOfCommentsGreaterThanStrategy = (
  aComments: Comment[],
  bComments: Comment[],
) => {
  return bComments.length - aComments.length;
};

const numberOfCommentsStrategies = {
  asc: numberOfCommentsLessThanStrategy,
  desc: numberOfCommentsGreaterThanStrategy,
};

const getUsersWithNumberOfCommentsOrder = async (
  users: User[],
  order: "asc" | "desc",
) => {
  const data = await mockedData;

  const usersWithComments = users.map((user) => {
    const comments = data.comments.filter(
      (comment) => comment.userId === user.userId,
    );
    return { ...user, comments };
  });

  return usersWithComments.sort((a, b) =>
    numberOfCommentsStrategies[order](a.comments, b.comments),
  ) as User[];
};

const userSortStrategies = {
  createdAt: getUsersWithCreatedAtOrder,
  numberOfPosts: getUsersWithNumberOfPostsOrder,
  numberOfComments: getUsersWithNumberOfCommentsOrder,
};

export const getUsers = async (options: {
  limit: number;
  sortedBy: "createdAt" | "numberOfPosts" | "numberOfComments";
  order: "asc" | "desc";
  includes: ("profile" | "comments" | "posts")[];
}) => {
  const { sortedBy, order, includes } = options;
  let { limit } = options;

  const data = await mockedData;

  const users = data.users;

  const sortedUsers = await userSortStrategies[sortedBy](users, order);

  if (limit < 0) {
    limit = sortedUsers.length;
  }

  if (includes.includes("profile")) {
    const profiles = sortedUsers.map((user) => {
      return data.profiles.find((profile) => profile.userId === user.userId);
    });

    sortedUsers.forEach((user, index) => {
      user.profile = profiles[index];
    });
  }

  if (includes.includes("posts")) {
    const posts = sortedUsers.map((user) => {
      return data.posts.filter((post) => post.userId === user.userId);
    });

    sortedUsers.forEach((user, index) => {
      user.posts = posts[index];
    });
  }

  if (includes.includes("comments")) {
    const comments = sortedUsers.map((user) => {
      return data.comments.filter((comment) => comment.userId === user.userId);
    });

    sortedUsers.forEach((user, index) => {
      user.comments = comments[index];
    });
  }

  return sortedUsers.slice(0, limit);
};

export const getUserById = async (
  userId: string,
  options: {
    includes: ("profile" | "comments" | "posts")[];
  },
) => {
  const data = await mockedData;

  const user = data.users.find((user) => user.userId === userId);

  if (!user) {
    return null;
  }

  if (options.includes.includes("profile")) {
    user.profile = data.profiles.find((profile) => profile.userId === userId);
  }

  if (options.includes.includes("posts")) {
    user.posts = data.posts.filter((post) => post.userId === userId);
  }

  if (options.includes.includes("comments")) {
    user.comments = data.comments.filter(
      (comment) => comment.userId === userId,
    );
  }

  return user;
};
