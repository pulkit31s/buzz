"use client";

import { useCallback, useEffect, useState } from "react";

import { feedApi } from "../services/feed.api";
import { Post } from "../types/post";

interface UseFeedReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useFeed(): UseFeedReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await feedApi.getFeed();

      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return {
    posts,
    loading,
    error,
    refresh: fetchFeed,
  };
}