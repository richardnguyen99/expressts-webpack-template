import { Data } from "../types";

export interface IncludeStrategy {
  include: (_comments: Data["comments"], _data: Data) => Data["comments"];
}
class CommentService {
  private _data: Data;
  private _comments: Data["comments"] | undefined = undefined;

  constructor(data: Data) {
    this._data = data;
  }

  query() {
    this._comments = this._data.comments;
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
    return this._comments;
  }
}

export default CommentService;
