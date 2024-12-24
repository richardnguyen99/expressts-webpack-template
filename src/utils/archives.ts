import { mockedData } from "../server";
import type { Post } from "../types";

export interface ArchiveList {
  [year: string]: {
    posts: Post[];
  }
}

const getArchives = async (): Promise<ArchiveList> => {
  const data = await mockedData;
  const archives: ArchiveList = {};

  data.posts.forEach((post) => {
    const year = new Date(post.createdAt).getFullYear();

    if (!archives[year]) {
      archives[year] = {
        posts: [],
      };
    }

    archives[year].posts.push(post);
  });

  return archives;
};


export default getArchives;
