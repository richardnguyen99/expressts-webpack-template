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
  job: string;
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
};
