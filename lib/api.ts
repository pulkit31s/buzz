import axios, { AxiosError, AxiosResponse } from "axios";

/**
 * Base Axios client configured for Buzz backend API.
 * Automatically sends and receives `httpOnly` JWT cookies via `withCredentials: true`.
 */
export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: automatically attaches JWT access token from localStorage
 * as `Authorization: Bearer <token>` header to prevent cross-domain cookie blocking on Netlify/Render.
 */
axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Interceptor to automatically unwrap standard backend API responses:
 * `{ success: true, statusCode: 200, message: "...", data: ... }` -> returns `response.data.data` (or `response.data` if no `.data` wrapper).
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && response.data.success !== undefined) {
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error: AxiosError<{ message?: string; errors?: any[] }>) => {
    let errorMessage = "An unexpected error occurred while communicating with the server.";

    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      const fieldErrors = error.response.data.errors
        .map((e: any) => e.message || (e.field ? `${e.field} is invalid` : ""))
        .filter(Boolean)
        .join("; ");
      const baseMessage = error.response?.data?.message || "Validation Error";
      errorMessage = fieldErrors ? `${baseMessage}: ${fieldErrors}` : baseMessage;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);
