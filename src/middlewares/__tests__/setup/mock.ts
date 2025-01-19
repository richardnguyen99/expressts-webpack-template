jest.mock("../../../server", () => {
  const { fakeUsers, fakeProfiles, fakePosts, fakeComments, fakeLikes } =
    jest.requireActual(
      "../../../utils/data",
    ) as typeof import("../../../utils/data");

  const users = fakeUsers(5);
  const profiles = fakeProfiles(users);
  const posts = fakePosts(10, users);
  const comments = fakeComments(20, users, posts);
  const likes = fakeLikes(50, users, posts);

  users.forEach((user) => {
    user.posts = posts.filter((post) => post.userId === user.userId);
    user.comments = comments.filter(
      (comment) => comment.userId === user.userId,
    );
    user.likes = likes.filter((like) => like.userId === user.userId);
    user.profile = profiles.find((profile) => profile.userId === user.userId);
    user.devices = [];
  });

  posts.forEach((post) => {
    post.author = {
      userId: post.userId,
      profile: profiles.find((profile) => profile.userId === post.userId)!,
    };

    post.comments = comments.filter(
      (comment) => comment.postId === post.postId,
    );

    post.likes = likes.filter((like) => like.postId === post.postId);
  });

  const generated = {
    users,
    devices: [],
    profiles,
    posts,
    comments,
    likes,
  };

  return {
    __esModule: true,
    mockedData: Promise.resolve(generated),
  };
});
