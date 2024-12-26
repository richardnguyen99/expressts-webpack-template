import fs from "fs";
import { faker } from "@faker-js/faker";
import RandExp from "randexp";

import type { User, Profile, Post, Comment } from "./src/types";

const categories = [
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
];

const generateFakeUsers = (): User => {
  return {
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: new RandExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,12}/).gen(),
    userId: faker.string.nanoid(10),
  };
};

const users = faker.helpers.multiple(generateFakeUsers, {
  count: 50,
});

const generateFakeProfiles = (userIndex: number): Profile => {
  return {
    userId: users[userIndex].userId,
    bio: faker.lorem.paragraph(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    job: faker.person.jobTitle(),
    dateOfBirth: faker.date
      .between({ from: "1970-01-01", to: "2003-12-31" })
      .getTime(),
    avatar: faker.image.avatar(),
    gender: faker.person.gender(),
    country: faker.location.country(),
  };
};

const profiles = faker.helpers.multiple((_, i) => generateFakeProfiles(i), {
  count: 50,
});

// Generate posts written by the users
const generateFakePosts = (): Post => {
  const title = faker.lorem.sentence().slice(0, -1);

  return {
    title,
    slug: title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, ""),
    content: faker.lorem.paragraphs(),
    userId: users[Math.floor(Math.random() * users.length)].userId,
    postId: faker.string.ulid().toLowerCase(),
    createdAt: faker.date
      .between({ from: "2021-01-01", to: "2024-12-01" })
      .getTime(),
    views: faker.number.int({ min: 100, max: 10000 }),
    likes: faker.number.int({ min: 10, max: 1000 }),
    category: categories[Math.floor(Math.random() * categories.length)],
    thumbnail: faker.image.urlPicsumPhotos({
      width: 1280,
      height: 720,
      grayscale: false,
      blur: 1,
    }),
  };
};

const posts = faker.helpers.multiple(generateFakePosts, {
  count: 100,
});

const generateFakeComments = (): Comment => {
  const postIndex = Math.floor(Math.random() * posts.length);

  return {
    content: faker.lorem.paragraph(),
    userId: users[Math.floor(Math.random() * users.length)].userId,
    postId: posts[postIndex].postId,
    commentId: faker.string.ulid().toLowerCase(),
    createdAt: faker.date.between({
      from: posts[postIndex].createdAt,
      to: "2024-12-01"
    }).getTime(),
  };
};

const comments = faker.helpers.multiple(generateFakeComments, {
  count: 100,
});

const generated = {
  users,
  profiles,
  posts,
  comments,
};

fs.writeFileSync("src/fake-data.json", JSON.stringify(generated, null, 2));
