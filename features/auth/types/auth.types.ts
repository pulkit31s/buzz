export interface UserProfile {
  _id?: string;
  id?: string;
  collegeId: string;
  email: string;
  username: string;
  anonymousName: string;
  anonymousAvatar: string;
  year: string;
  branch: string;
  verified: boolean;
  createdAt?: string;
}

export interface RegisterPayload {
  collegeId: string;
  email: string;
  password?: string;
  username: string;
  year: string;
  branch: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken?: string;
}
