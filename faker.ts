import fs from "fs";

import {
  fakeComments,
  fakeDevices,
  fakeLikes,
  fakeNotifications,
  fakePosts,
  fakeProfiles,
  fakeUsers,
} from "./src/utils/data";

const users = fakeUsers(50);
const devices = fakeDevices(75, users);
const profiles = fakeProfiles(users);
const posts = fakePosts(250, users);
const comments = fakeComments(500, users, posts);
const likes = fakeLikes(5000, users, posts);
const notifications = fakeNotifications(users, posts, likes, comments);

const generated = {
  users,
  devices,
  profiles,
  posts,
  comments,
  likes,
  notifications,
};

fs.writeFileSync("src/fake-data.json", JSON.stringify(generated, null, 2));
