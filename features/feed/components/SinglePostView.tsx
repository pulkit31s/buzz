"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Send, ThumbsUp, Sparkles } from "lucide-react";
import { feedApi } from "../services/feed.api";
import { commentApi, type CommentItem } from "../services/comment.api";
import { Post } from "../types/post";
import PostCard from "./PostCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function SinglePostView({ postId }: { postId: string }) {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comment input state
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPostAndComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [postData, commentsData] = await Promise.all([
        feedApi.getPost(postId),
        commentApi.getCommentsByPost(postId),
      ]);

      if (!postData) {
        setError("Post not found on campus feed.");
      } else {
        setPost(postData);
        setComments(commentsData);
      }
    } catch (err) {
      setError("Failed to load post details.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const newComment = await commentApi.createComment(postId, commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      if (post) {
        setPost({
          ...post,
          stats: {
            ...post.stats,
            comments: post.stats.comments + 1,
          },
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft size={16} /> Back to Feed
        </button>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <MessageSquare size={28} />
        </div>
        <h3 className="text-lg font-bold text-neutral-800">{error || "Post not found"}</h3>
        <p className="mt-1 text-sm text-neutral-500">This post may have been removed or deleted.</p>
        <button
          onClick={() => router.push("/feed")}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-600 shadow-sm border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
      >
        <ArrowLeft size={16} /> Back to Campus Feed
      </button>

      {/* Main Post Card */}
      <PostCard post={post} />

      {/* Comments Section */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b pb-4 text-base font-bold text-neutral-800">
          <MessageSquare size={20} className="text-blue-600" />
          <span>Comments ({comments.length})</span>
        </div>

        {/* Add Comment Input */}
        <form onSubmit={handleAddComment} className="mt-4 flex items-start gap-3">
          {user ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
              {user.anonymousName?.charAt(0) || "A"}
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
              <Sparkles size={16} />
            </div>
          )}

          <div className="flex-1">
            <textarea
              rows={2}
              placeholder={user ? "Add an anonymous comment to this discussion..." : "Sign in to join the anonymous discussion..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onClick={() => {
                if (!user) openAuthModal();
              }}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                {user ? `Commenting as ${user.anonymousName}` : "Your identity remains hidden from other students."}
              </span>
              <button
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                <Send size={14} />
                <span>{submittingComment ? "Posting..." : "Comment"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="mt-6 space-y-4">
          {comments.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-400">
              No comments yet. Be the first to start the conversation!
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id || comment._id}
                className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:bg-neutral-50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {comment.author?.username?.charAt(0) || "A"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">
                      {comment.author?.username || "Anonymous Student"}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
