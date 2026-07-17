"use client";

import { useState } from "react";

import { createPostApi } from "../services/createPostApi";
import type {
  CreatePostPayload,
  CreatePostResponse,
} from "../types/createPost";

export function useCreatePost() {
  const [loading, setLoading] = useState(false);

  async function createPost(
    payload: CreatePostPayload
  ): Promise<CreatePostResponse> {
    setLoading(true);

    try {
      return await createPostApi.createPost(payload);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    createPost,
  };
}