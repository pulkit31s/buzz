export interface PostAuthor {
  id: string;
  username: string;
  avatar?: string;
  year?: string;
  verified?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PostPoll {
  question: string;
  options: PollOption[];
}

export interface PostEvent {
  title: string;
  date: string;
  location: string;
}

export interface PostStats {
  upvotes: number;
  comments: number;
  shares: number;
  bookmarks: number;
}

export interface UserInteraction {
  upvoted: boolean;
  bookmarked: boolean;
}

export interface Post {
  id: string;

  author: PostAuthor;

  content: string;

  images?: string[];

  poll?: PostPoll;

  event?: PostEvent;

  createdAt: string;

  stats: PostStats;

  userInteraction: UserInteraction;

  tags?: string[];
}