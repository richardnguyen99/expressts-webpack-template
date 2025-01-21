export type User = {
  username: string;
  password: string;
  email: string;
  userId: string;
  createdAt: number;
  verified: boolean;

  profile?: Profile;
  posts?: Post[];
  comments?: Comment[];
  devices?: Device[];
  likes?: Like[];
};

export type Device = {
  deviceId: string;
  os: string;
  browser: string;
  device: string;
  ip: string;
  engine: string;
  loggedInTime: number;
  userId: string;
  geo: {
    city: string;
    region: string;
    country: string;
  };

  user?: User;
};

export type Profile = {
  userId: string;
  bio: string;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  avatar: string;
  gender: string;
  phone: string;
  country: string;
  job: string;
  address: string;

  user?: User;
};

export type Comment = {
  content: string;
  userId: string;
  postId: string;
  commentId: string;
  createdAt: number;

  user?: User;
  profile?: Profile;
  post?: Post;
};

export type Like = {
  likeId: string;
  userId: string;
  postId: string;
  createdAt: number;

  user?: User;
  post?: Post;
};

export type Post = {
  title: string;
  slug: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: number;
  thumbnail: string;
  category: string;
  views: number;

  author?: {
    userId: string;
    profile: Profile;
  };

  comments?: Comment[];
  likes?: Like[];
  timeToRead?: number;
};

export type Data = {
  users: User[];
  profiles: Profile[];
  posts: Post[];
  comments: Comment[];
  devices: Device[];
  likes: Like[];
};

export type ResponseLocals = {
  user?: User;
  profile?: Profile;
};
