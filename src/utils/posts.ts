import { mockedData } from "../server";

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

export const getPostsByUserId = async (userId: string) => {
  const data = await mockedData;
  const posts = data.posts.filter((post) => post.userId === userId);

  return posts;
};

export const getPostsBySlug = async (slug: string) => {
  const data = await mockedData;
  const posts = data.posts.find((post) => post.slug === slug);

  return posts;
};

export const getTopCategories = async (count: number) => {
  const data = await mockedData;
  const posts = data.posts;

  const categories = posts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = 1;
    } else {
      acc[post.category] += 1;
    }

    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.keys(categories)
    .sort((a, b) => categories[b] - categories[a])
    .slice(0, count);

  return topCategories;
};
