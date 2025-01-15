import fs from "fs";

import {
  fakeComments,
  fakeDevices,
  fakeLikes,
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

const generated = {
  users,
  devices,
  profiles,
  posts,
  comments,
  likes,
};

fs.writeFileSync("src/fake-data.json", JSON.stringify(generated, null, 2));
