"use client";

import CreatePostButton from "./CreatePostButton";
import EmptyFeed from "./EmptyFeed";
import FeedHeader from "./FeedHeader";
import FeedTabs from "./FeedTabs";
import LoadingSkeleton from "./LoadingSkeleton";
import PostCard from "./PostCard";
import ErrorState from "./ErrorState";

import { useFeed } from "../hooks/useFeed";

export default function Feed() {
  const { posts, loading, error, refresh } = useFeed();

  return (
    <main className="min-h-screen bg-gray-50">
      <FeedHeader />

      <div className="mx-auto max-w-2xl px-4 py-6">
        <FeedTabs />

        {loading && <LoadingSkeleton />}

{!loading && error && (
  <ErrorState
    description={error}
    onRetry={refresh}
  />
)}

{!loading && !error && posts.length === 0 && (
  <EmptyFeed />
)}

{!loading && !error && posts.length > 0 && (
  <div className="mt-6 space-y-4">
    {posts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
      />
    ))}
  </div>
)}
      </div>

      <CreatePostButton />
    </main>
  );
}