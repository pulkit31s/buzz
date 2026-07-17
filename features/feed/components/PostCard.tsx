import { Post } from "../types/post";
import PostActions from "./PostActions";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <PostHeader
        author={post.author}
        createdAt={post.createdAt}
      />

      <PostBody
        content={post.content}
      />

      <PostActions
        postId={post.id}
        stats={post.stats}
        userInteraction={post.userInteraction}
      />
    </article>
  );
}