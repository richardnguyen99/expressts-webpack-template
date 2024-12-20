export type User = {
  username: string;
  password: string;
  email: string;
  userId: string;
};

export type Profile = {
  userId: string;
  bio: string;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
  avatar: string;
  gender: string;
  country: string;
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
};

export type Data = {
  users: User[];
  profiles: Profile[];
  posts: Post[];
};
