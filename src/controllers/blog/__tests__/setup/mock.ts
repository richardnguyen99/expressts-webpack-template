jest.mock("../../../../server", () => {
  const { fakeUsers, fakeProfiles, fakePosts, fakeComments } =
    jest.requireActual(
      "../../../../utils/data",
    ) as typeof import("../../../../utils/data");

  const users = fakeUsers(5);
  const profiles = fakeProfiles(users);
  const posts = fakePosts(20, users);
  const comments = fakeComments(50, users, posts);

  const generated = {
    users,
    devices: [],
    profiles,
    posts,
    comments,
  };

  return {
    __esModule: true,
    mockedData: Promise.resolve(generated),
  };
});
