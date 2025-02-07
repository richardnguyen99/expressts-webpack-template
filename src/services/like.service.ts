import { Data } from "../types";

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

  execute() {
    return this._likes;
  }
}

export default LikeService;
