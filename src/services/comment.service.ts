import { Data } from "../types";

export interface IncludeStrategy {
  include: (_comments: Data["comments"], _data: Data) => Data["comments"];
}
class CommentService {
  private _data: Data;
  private _comments: Data["comments"] | undefined = undefined;
  private _limit: number | undefined = undefined;
  private _offset: number | undefined = undefined;
  private _joins: {
    user: () => void;
    profile: () => void;
  };

  constructor(data: Data) {
    this._data = data;
    this._joins = {
      user: this._joinUser.bind(this),
      profile: this._joinProfile.bind(this),
    };
  }

  query() {
    this._comments = this._data.comments;
    return this;
  }

  join(entity: "user" | "profile") {
    if (!this._comments) {
      throw new Error("No comments available to include.");
    }

    this._joins[entity]();

    return this;
  }

  where(filterFn: (_: Data["comments"][number]) => boolean) {
    if (!this._comments) {
      throw new Error("No comments available to filter.");
    }

    this._comments = this._comments.filter(filterFn);
    return this;
  }

  includes(strategies: IncludeStrategy[]) {
    if (!this._comments) {
      throw new Error("No comments available to include.");
    }

    for (const strategy of strategies) {
      this._comments = strategy.include(this._comments, this._data);
    }

    return this;
  }

  execute() {
    if (this._comments === undefined) {
      throw new Error("No comments available to execute.");
    }

    return this._comments.slice(this._offset, this._limit);
  }

  private _joinUser() {
    this._comments = this._comments!.map((comment) => ({
      ...comment,
      user: this._data.users.find((user) => user.userId === comment.userId),
    }));
  }

  private _joinProfile() {
    this._comments = this._comments!.map((comment) => ({
      ...comment,
      profile: this._data.profiles.find(
        (profile) => profile.userId === comment.userId,
      ),
    }));
  }
}

export default CommentService;
