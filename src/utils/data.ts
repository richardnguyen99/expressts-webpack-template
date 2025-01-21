import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import uap from "ua-parser-js";
import geoip from "geoip-lite";
import cryptol from "crypto";

import {
  Device,
  Profile,
  User,
  Post,
  Comment,
  Like,
  Notification,
} from "../types";

export const fakeCategories = [
  "technology",
  "science",
  "health",
  "business",
  "politics",
  "entertainment",
  "sports",
  "travel",
  "lifestyle",
  "fashion",
  "music",
  "art",
] as const;

export const fakeUserGenerator = (): User => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: new RandExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,12}/).gen(),
    userId: faker.string.nanoid(10),
    createdAt: faker.date
      .between({ from: "2019-01-01", to: "2020-12-01" })
      .getTime(),
    verified: faker.datatype.boolean(),
  };
};

export const fakeUsers = (
  count: number,
  generator: () => User = fakeUserGenerator,
): User[] => {
  return faker.helpers.multiple(generator, { count });
};

export const fakeDeviceGenerator = (
  users: User[],
  userIndex: number,
): Device => {
  const userAgent = faker.internet.userAgent();
  const UA = uap.UAParser(userAgent);
  const ip = faker.internet.ipv4();
  const geo = geoip.lookup(ip);
  const loggedInTime = faker.date.recent().getTime();
  const hash = cryptol.createHash("sha256");

  hash
    .update(UA.os.name || "Unknown")
    .update(UA.browser.name || "Unknown")
    .update(UA.device.model || "Unknown")
    .update(UA.engine.name || "Unknown")
    .update(ip);

  return {
    deviceId: hash.digest("hex"),
    os: UA.os.name!,
    browser: UA.browser.name!,
    device: UA.device.model!,
    ip: ip,
    loggedInTime,
    engine: UA.engine.name!,
    userId: users[userIndex].userId,
    geo: {
      country: geo?.country || "Unknown",
      region: geo?.region || "Unknown",
      city: geo?.city || "Unknown",
    },
  };
};

export const fakeDevices = (
  count: number,
  users: User[],
  generator: typeof fakeDeviceGenerator = fakeDeviceGenerator,
): Device[] => {
  return faker.helpers.multiple((_, i) => generator(users, i % users.length), {
    count,
  });
};

export const fakeProfileGenerator = (
  users: User[],
  userIndex: number,
): Profile => {
  return {
    userId: users[userIndex].userId,
    bio: faker.lorem.paragraph(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    job: faker.person.jobTitle(),
    phone: faker.phone.number(),
    dateOfBirth: faker.date
      .between({ from: "1970-01-01", to: "2003-12-31" })
      .getTime(),
    avatar: faker.image.avatar(),
    gender: faker.person.gender(),
    country: faker.location.countryCode("alpha-2"),
    address: faker.location.streetAddress(),
  };
};

export const fakeProfiles = (
  users: User[],
  generator: typeof fakeProfileGenerator = fakeProfileGenerator,
): Profile[] => {
  return faker.helpers.multiple((_, i) => generator(users, i), {
    count: users.length,
  });
};

export const fakePostGenerator = (users: User[], i: number): Post => {
  const title = faker.lorem.sentence().slice(0, -1);

  return {
    title,
    slug: title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, ""),
    content: faker.lorem
      .paragraphs({
        min: 5,
        max: 15,
      })
      .split("\n")
      .map((p) => `<p>${p}</p>`)
      .join("\n"),
    userId: users[Math.floor(Math.random() * users.length)].userId,
    postId: faker.string.ulid().toLowerCase(),
    createdAt: faker.date
      .between({ from: "2021-01-01", to: "2024-12-01" })
      .getTime(),
    views: faker.number.int({ min: 100, max: 10000 }),
    category: fakeCategories[i % fakeCategories.length],
    thumbnail: faker.image.urlPicsumPhotos({
      width: 1280,
      height: 720,
      grayscale: false,
      blur: 1,
    }),
  };
};

export const fakePosts = (
  count: number,
  users: User[],
  generator: typeof fakePostGenerator = fakePostGenerator,
): Post[] => {
  return faker.helpers.multiple((_v, i) => generator(users, i), { count });
};

export const fakeCommentGenerator = (users: User[], posts: Post[]): Comment => {
  const postIndex = Math.floor(Math.random() * posts.length);

  return {
    content: faker.lorem.paragraph(),
    userId: users[Math.floor(Math.random() * users.length)].userId,
    postId: posts[postIndex].postId,
    commentId: faker.string.ulid().toLowerCase(),
    createdAt: faker.date
      .between({
        from: posts[postIndex].createdAt,
        to: "2024-12-01",
      })
      .getTime(),
  };
};

export const fakeComments = (
  count: number,
  users: User[],
  posts: Post[],
  generator: typeof fakeCommentGenerator = fakeCommentGenerator,
): Comment[] => {
  return faker.helpers.multiple((_a, _b) => generator(users, posts), {
    count,
  });
};

export const fakeLikeGenerator = (users: User[], posts: Post[]): Like => {
  const postIndex = Math.floor(Math.random() * posts.length);

  return {
    likeId: faker.string.ulid().toLowerCase(),
    userId: users[Math.floor(Math.random() * users.length)].userId,
    postId: posts[postIndex].postId,
    createdAt: faker.date
      .between({
        from: posts[postIndex].createdAt,
        to: "2024-12-01",
      })
      .getTime(),
  };
};

export const fakeLikes = (
  count: number,
  users: User[],
  posts: Post[],
  generator: typeof fakeLikeGenerator = fakeLikeGenerator,
): Like[] => {
  return faker.helpers.multiple((_a, _b) => generator(users, posts), {
    count,
  });
};

export const fakeNotifications = (
  users: User[],
  posts: Post[],
  likes: Like[],
  comments: Comment[],
): Notification[] => {
  return [
    ...likes.map((like) => {
      const post = posts.find((post) => post.postId === like.postId)!;
      const author = users.find((user) => user.userId === post.userId)!;

      return {
        notificationId: faker.string.ulid().toLowerCase(),
        recipientId: author.userId,
        senderId: like.userId,
        type: "like",
        entityType: "post",
        entityId: post.postId,
        createdAt: like.createdAt,
        isRead: faker.datatype.boolean(),
        title: `${author.username} liked your post <a href="/posts/${post.slug}">${post.slug}</a>`,
      } as Notification;
    }),

    ...comments.map((comment) => {
      const post = posts.find((post) => post.postId === comment.postId)!;
      const author = users.find((user) => user.userId === post.userId)!;

      return {
        notificationId: faker.string.ulid().toLowerCase(),
        recipientId: author.userId,
        senderId: comment.userId,
        type: "comment",
        entityType: "post",
        entityId: post.postId,
        createdAt: comment.createdAt,
        isRead: faker.datatype.boolean(),
        title: `${author.username} commented on your post <a href="/posts/${post.slug}">${post.slug}</a>`,
        content: comment.content,
      } as Notification;
    }),
  ];
};
