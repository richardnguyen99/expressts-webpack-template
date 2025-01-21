import { mockedData } from "../server";
import { type Comment } from "../types";

const includeAuthorToComment = async (comment: Comment) => {
  const data = await mockedData;
  const author = data.profiles.find(
    (profile) => profile.userId === comment.userId,
  );

  const user = data.users.find((user) => user.userId === comment.userId);

  comment.user = user;
  comment.profile = author;
};

const includesAuthorStrategy = async (comments: Comment[]) => {
  comments.forEach(async (comment) => {
    await includeAuthorToComment(comment);
  });
};

export const getCommmentsByPostId = async (
  postId: string,
  options: {
    limit: number;
    includes: "author"[];
  },
) => {
  let { limit } = options;

  const data = await mockedData;
  const comments = data.comments.filter((comment) => comment.postId === postId);

  if (limit < 0) {
    limit = comments.length;
  }

  if (options.includes.includes("author")) {
    await includesAuthorStrategy(comments);
  }

  return comments
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
};

export const getCommentById = async (
  commentId: string,
  options: {
    includes: "author"[];
  },
) => {
  const data = await mockedData;
  const comment = data.comments.find(
    (comment) => comment.commentId === commentId,
  );

  if (comment && options.includes.includes("author")) {
    await includeAuthorToComment(comment);
  }

  return comment;
};

const createdAtSortStrategy = (
  a: Comment,
  b: Comment,
  type: "asc" | "desc",
) => {
  if (type === "asc") {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

const sortStrategies = {
  createdAt: createdAtSortStrategy,
};

export const getCommentsByUserId = async (
  userId: string,
  options?: {
    order: "asc" | "desc";
    limit: number;
    sortedBy: "createdAt";
    includes: "author"[];
  },
): Promise<Comment[]> => {
  const data = await mockedData;
  const comments = data.comments.filter((comment) => comment.userId === userId);

  const sortedBy = options && options.sortedBy ? options.sortedBy : "createdAt";
  const sortOrder = (options && options.order) || "desc";
  const limit: number =
    options && options.limit
      ? options.limit > 0
        ? options.limit
        : comments.length
      : comments.length;

  comments.sort((a, b) => sortStrategies[sortedBy](a, b, sortOrder));

  if (options && options.includes.includes("author")) {
    await includesAuthorStrategy(comments);
  }

  return comments.slice(0, limit);
};
