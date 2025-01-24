import { Data, Post } from "../types";

export interface IncludeStrategy {
  include: (_posts: Post[], _data: Data) => Post[];
}

class PostService {
  private _data: Data;
  private _limit: number = 10;
  private _offset: number = 0;
  private _posts: Post[] | undefined = undefined;
  private _joins: {
    author: () => void;
    comments: () => void;
    likes: () => void;
  };

  constructor(data: Data) {
    this._data = data;

    this._joins = {
      author: this._joinAuthor.bind(this),
      comments: this._joinComments.bind(this),
      likes: this._joinLikes.bind(this),
    };
  }

  query() {
    this._posts = this._data.posts;
    return this;
  }

  where(filterFn: (_: Post) => boolean) {
    if (!this._posts) {
      throw new Error("No posts available to filter.");
    }

    this._posts = this._posts.filter(filterFn);
    return this;
  }

  join(entity: "author" | "comments" | "likes") {
    if (!this._posts) {
      throw new Error("No posts available to include.");
    }

    this._joins[entity]();

    return this;
  }

  include(includeFn: (_posts: Post[], _data: Data) => Post[]) {
    if (!this._posts) {
      throw new Error("No posts available to include.");
    }

    this._posts = includeFn(this._posts, this._data);
    return this;
  }

  includes(includeStrategies: IncludeStrategy[]) {
    if (!this._posts) {
      throw new Error("No posts available to include.");
    }

    for (const strategy of includeStrategies) {
      this._posts = strategy.include(this._posts, this._data);
    }
    return this;
  }

  sort(sortFn: (_posts: Post[]) => Post[]) {
    if (!this._posts) {
      throw new Error("No posts available to sort.");
    }

    this._posts = sortFn(this._posts);
    return this;
  }

  limit(limit: number) {
    if (!this._posts) {
      throw new Error("No posts available to sort.");
    }

    this._limit = limit;
    return this;
  }

  offset(offset: number) {
    if (!this._posts) {
      throw new Error("No posts available to sort.");
    }

    this._offset = offset;
    return this;
  }

  add(post: Post) {
    if (!this._posts) {
      throw new Error("No posts available to sort.");
    }

    this._posts.push(post);
    return this;
  }

  remove(post: Post) {
    if (!this._posts) {
      throw new Error("No posts available to sort.");
    }

    this._posts = this._posts.filter((p) => p.postId !== post.postId);
    return this;
  }

  update(oldPost: Post, newPost: Partial<Post>) {
    if (!this._posts) {
      throw new Error("No posts available to sort.");
    }

    const postIndex = this._posts.findIndex((p) => p.postId === oldPost.postId);
    this._posts[postIndex] = { ...this._posts[postIndex], ...newPost };

    return this;
  }

  execute() {
    if (!this._posts) {
      throw new Error("No posts available to sort.");
    }

    return this._posts.slice(this._offset, this._offset + this._limit);
  }

  private _joinAuthor() {
    if (!this._posts) {
      throw new Error("No posts available to include.");
    }

    this._posts = this._posts.map((post) => {
      const profile = this._data.profiles.find(
        (user) => user.userId === post.userId,
      )!;

      return {
        ...post,
        author: {
          userId: profile?.userId,
          profile,
        },
      };
    });
  }

  private _joinComments() {
    if (!this._posts) {
      throw new Error("No posts available to include.");
    }

    this._posts = this._posts.map((post) => {
      const comments = this._data.comments.filter(
        (comment) => comment.postId === post.postId,
      );

      return {
        ...post,
        comments,
      };
    });
  }

  private _joinLikes() {
    if (!this._posts) {
      throw new Error("No posts available to include.");
    }

    this._posts = this._posts.map((post) => {
      const likes = this._data.likes.filter(
        (like) => like.postId === post.postId,
      );

      return {
        ...post,
        likes,
      };
    });
  }
}

export default PostService;
