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
  }
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
};

export type Comment = {
  content: string;
  userId: string;
  postId: string;
  commentId: string;
  createdAt: number;

  author?: {
    userId: string;
    profile: Profile;
  };
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
  likes: number;

  author?: {
    userId: string;
    profile: Profile;
  };

  comments?: Comment[];
  timeToRead?: number;
};

export type Data = {
  users: User[];
  profiles: Profile[];
  posts: Post[];
  comments: Comment[];
  devices: Device[];
};

export type ResponseLocals = {
  user?: User;
  profile?: Profile;
}
