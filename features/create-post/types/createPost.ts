export interface CreatePollOption {
  text: string;
}

export interface CreatePoll {
  question: string;
  options: CreatePollOption[];
}

export interface CreatePostPayload {
  content: string;

  images: File[];

  tags: string[];

  poll?: CreatePoll;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
}