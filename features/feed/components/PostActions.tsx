"use client";

import { useState } from "react";
import {
  ArrowBigUp,
  MessageCircle,
  Bookmark,
  Share2,
} from "lucide-react";
import { feedApi } from "../services/feed.api";
import { useAuth } from "@/features/auth/context/AuthContext";
import { PostStats, UserInteraction } from "../types/post";

interface PostActionsProps {
  postId: string;
  stats: PostStats;
  userInteraction: UserInteraction;
}

export default function PostActions({
  postId,
  stats,
  userInteraction,
}: PostActionsProps) {
  const { user, openAuthModal } = useAuth();
  const [upvoted, setUpvoted] = useState(userInteraction.upvoted);
  const [bookmarked, setBookmarked] = useState(userInteraction.bookmarked);
  const [upvotes, setUpvotes] = useState(stats.upvotes);
  const [loadingAction, setLoadingAction] = useState(false);

  async function toggleUpvote() {
    if (!user) {
      openAuthModal();
      return;
    }
    if (loadingAction) return;

    // Optimistic UI update
    const prevUpvoted = upvoted;
    const prevCount = upvotes;

    setUpvoted(!prevUpvoted);
    setUpvotes((prev) => (prevUpvoted ? Math.max(0, prev - 1) : prev + 1));
    setLoadingAction(true);

    try {
      const result = await feedApi.toggleUpvote(postId);
      setUpvoted(result.upvoted);
      setUpvotes(result.upvotesCount);
    } catch (err) {
      // Revert if error
      setUpvoted(prevUpvoted);
      setUpvotes(prevCount);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleBookmark() {
    if (!user) {
      openAuthModal();
      return;
    }
    if (loadingAction) return;

    const prevBookmarked = bookmarked;
    setBookmarked(!prevBookmarked);
    setLoadingAction(true);

    try {
      const result = await feedApi.toggleBookmark(postId);
      setBookmarked(result.bookmarked);
    } catch (err) {
      setBookmarked(prevBookmarked);
    } finally {
      setLoadingAction(false);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "Buzz Campus Post",
        text: "Check out this anonymous post on Buzz!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }

  return (
    <div className="mt-5 flex items-center justify-between border-t pt-4 text-gray-600">
      <button
        onClick={toggleUpvote}
        disabled={loadingAction}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all ${
          upvoted
            ? "bg-blue-50 text-blue-600 shadow-inner"
            : "hover:bg-neutral-100 hover:text-blue-600"
        }`}
      >
        <ArrowBigUp size={20} className={upvoted ? "fill-blue-600" : ""} />
        <span className="text-sm">{upvotes}</span>
      </button>

      <button
        onClick={() => {
          if (!user) openAuthModal();
        }}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors hover:bg-neutral-100 hover:text-blue-600"
      >
        <MessageCircle size={18} />
        <span className="text-sm">{stats.comments}</span>
      </button>

      <button
        onClick={handleBookmark}
        disabled={loadingAction}
        title={bookmarked ? "Bookmarked" : "Bookmark post"}
        className={`rounded-full p-2 transition-colors ${
          bookmarked ? "bg-blue-50 text-blue-600" : "hover:bg-neutral-100"
        }`}
      >
        <Bookmark
          fill={bookmarked ? "currentColor" : "none"}
          size={18}
        />
      </button>

      <button
        onClick={handleShare}
        title="Share post"
        className="rounded-full p-2 transition-colors hover:bg-neutral-100"
      >
        <Share2 size={18} />
      </button>
    </div>
  );
}