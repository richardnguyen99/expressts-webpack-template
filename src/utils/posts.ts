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

export const getArchives = async () => {
  const data = await mockedData;
  const posts = data.posts;

  const archives = posts.reduce((acc, post) => {
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
  }, {} as Record<string, Record<string, number>>);

  return archives;
};

export const getLatestArchives = async (limit: number) => {
  const data = await mockedData;
  const posts = data.posts;

  const archives = posts.reduce((acc, post) => {
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
  }, {} as Record<string, Record<string, number>>);

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
