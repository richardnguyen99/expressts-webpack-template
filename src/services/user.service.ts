import { Data, User } from "../types";
import CommentService from "./comment.service";

type Entity = "posts" | "comments" | "likes" | "profile";
class UserService {
  private _data: Data;
  private _users: User[] | undefined = undefined;
  private _joinMap: { [_key in Entity]: () => void };
  private _limit: number | undefined = undefined;
  private _offset: number | undefined = undefined;

  constructor(data: Data) {
    this._data = data;
    this._joinMap = {
      posts: this._joinPosts.bind(this),
      comments: this._joinComments.bind(this),
      likes: this._joinLikes.bind(this),
      profile: this._joinProfile.bind(this),
    };
  }

  query(...fields: (keyof User)[]) {
    if (fields.length > 0) {
      this._users = this._data.users.map((user) => {
        const filteredUser: Partial<User> = {};
        for (const field of fields) {
          // @ts-expect-error should pass
          filteredUser[field] = user[field];
        }
        return filteredUser as User;
      });
    } else {
      this._users = this._data.users.map((user) => ({ ...user }));
    }

    return this;
  }

  where(filterFn: (_: User) => boolean) {
    if (typeof this._users === "undefined") {
      throw new Error("No users available to filter.");
    }

    this._users = this._users.filter(filterFn);

    return this;
  }

  join(entity: Entity) {
    if (typeof this._users === "undefined") {
      throw new Error("No users available to include.");
    }

    this._joinMap[entity]();

    return this;
  }

  limit(limit: number) {
    this._limit = limit;
    return this;
  }

  offset(offset: number) {
    this._offset = offset;
    return this;
  }

  sort(sortFn: (_: User[]) => User[]) {
    if (typeof this._users === "undefined") {
      throw new Error("No users available to sort.");
    }

    this._users = sortFn(this._users);
    return this;
  }

  first() {
    if (typeof this._users === "undefined") {
      throw new Error("No users available to execute.");
    }

    if (this._users.length === 0) {
      return undefined;
    }

    return this._users[0];
  }

  firstOrFail() {
    if (!this._users || this._users.length === 0) {
      throw new Error("No users available to execute.");
    }

    return this._users[0];
  }

  execute() {
    if (this._users === undefined) {
      throw new Error("No users available to execute.");
    }

    return this._users.slice(this._offset, this._limit);
  }

  private _joinPosts() {
    this._users = this._users!.map((user) => ({
      ...user,
      posts: this._data.posts.filter((post) => post.userId === user.userId),
    }));
  }

  private _joinComments() {
    this._users = this._users!.map((user) => ({
      ...user,
      comments: new CommentService(this._data)
        .query()
        .where((comment) => comment.userId === user.userId)
        .execute(),
    }));
  }

  private _joinLikes() {
    this._users = this._users!.map((user) => ({
      ...user,
      likes: this._data.likes.filter((like) => like.userId === user.userId),
    }));
  }

  private _joinProfile() {
    this._users = this._users!.map((user) => ({
      ...user,
      profile: this._data.profiles.find(
        (profile) => profile.userId === user.userId,
      ),
    }));
  }
}

export default UserService;
