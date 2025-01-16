import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

import { Data, User } from "../types";

interface InsertUserDto {
  email: string;
  password: string;
  username: string;
}

class UserService {
  private _data: Data;

  constructor(data: Data) {
    this._data = data;
  }

  public async getUsers(options: {
    limit?: number;
    offset?: number;
    sort?: (_a: User, _b: User) => number;
    filter?: (_user: User) => boolean;
    includes?: ("posts" | "comments" | "profile")[];
  }) {
    const { sort, includes, filter } = options;
    const limit = options.limit || 10;
    const offset = options.offset || 0;

    let users = this._data.users;

    users = users.map((user) => {
      user.profile = this._data.profiles.find(
        (profile) => profile.userId === user.userId,
      );

      user.posts = this._data.posts.filter(
        (post) => post.userId === user.userId,
      );

      user.comments = this._data.comments.filter(
        (comment) => comment.userId === user.userId,
      );

      return user;
    });

    if (sort) {
      users = users.sort(sort);
    }

    if (filter) {
      users = users.filter(filter);
    }

    if (includes && !includes.includes("posts")) {
      users = users.map((user) => {
        delete user.posts;
        return user;
      });
    }

    if (includes && !includes.includes("comments")) {
      users = users.map((user) => {
        delete user.comments;
        return user;
      });
    }

    return users.slice(offset, offset + limit);
  }

  public async findUserById(userId: string) {
    const user = this._data.users.find((user) => user.userId === userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.posts = this._data.posts.filter((post) => post.userId === user.userId);

    user.comments = this._data.comments.filter(
      (comment) => comment.userId === user.userId,
    );

    user.profile = this._data.profiles.find(
      (profile) => profile.userId === user.userId,
    );

    return user;
  }

  public async findUserByEmail(email: string) {
    const user = this._data.users.find((user) => user.email === email);

    if (!user) {
      throw new Error("User not found");
    }

    user.posts = this._data.posts.filter((post) => post.userId === user.userId);

    user.comments = this._data.comments.filter(
      (comment) => comment.userId === user.userId,
    );

    user.profile = this._data.profiles.find(
      (profile) => profile.userId === user.userId,
    );

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = this._data.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    user.posts = this._data.posts.filter((post) => post.userId === user.userId);

    user.comments = this._data.comments.filter(
      (comment) => comment.userId === user.userId,
    );

    user.profile = this._data.profiles.find(
      (profile) => profile.userId === user.userId,
    );

    return user;
  }

  public async createUser(userDto: InsertUserDto) {
    const { email, password, username } = userDto;

    const user = this._data.users.find((user) => user.email === email);

    if (user) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      userId: faker.string.nanoid(9),
      email,
      password: hashedPassword,
      username,
      verified: false,
      createdAt: Date.now(),
    };

    this._data.users.push(newUser);

    return newUser;
  }

  public async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}

export default UserService;
