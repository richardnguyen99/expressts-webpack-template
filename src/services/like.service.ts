import { Data } from "../types";

export interface IncludeStrategy {
  include: (_likes: Data["likes"], _data: Data) => Data["likes"];
}
class LikeService {
  private _data: Data;
  private _likes: Data["likes"] | undefined = undefined;

  constructor(data: Data) {
    this._data = data;
  }

  query() {
    this._likes = this._data.likes;
    return this;
  }

  where(filterFn: (_: Data["likes"][number]) => boolean) {
    if (!this._likes) {
      throw new Error("No likes available to filter.");
    }

    this._likes = this._likes.filter(filterFn);
    return this;
  }

  includes(strategies: IncludeStrategy[]) {
    if (!this._likes) {
      throw new Error("No likes available to include.");
    }

    for (const strategy of strategies) {
      this._likes = strategy.include(this._likes, this._data);
    }

    return this;
  }

  execute() {
    return this._likes;
  }
}

export default LikeService;
