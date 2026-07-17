import React from "react";
import SinglePostView from "@/features/feed/components/SinglePostView";

interface PageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId } = await params;
  return <SinglePostView postId={postId} />;
}
