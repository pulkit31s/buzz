import { axiosClient } from "../../../lib/api";
import type { RegisterPayload, LoginPayload, AuthResponse, UserProfile } from "../types/auth.types";

export const authApi = {
  /**
   * POST /api/v1/auth/register
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await axiosClient.post("/auth/register", payload);
    return (data as any) as AuthResponse;
  },

  /**
   * POST /api/v1/auth/login
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await axiosClient.post("/auth/login", payload);
    return (data as any) as AuthResponse;
  },

  /**
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    await axiosClient.post("/auth/logout");
  },

  /**
   * GET /api/v1/users/me
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const data = await axiosClient.get("/users/me");
      return (data as any) as UserProfile;
    } catch (err) {
      return null;
    }
  },
};
