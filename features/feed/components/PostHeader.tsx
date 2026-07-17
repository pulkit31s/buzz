import { MoreHorizontal } from "lucide-react";
import { PostAuthor } from "../types/post";

interface PostHeaderProps {
  author: PostAuthor;
  createdAt: string;
}

export default function PostHeader({
  author,
  createdAt,
}: PostHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
          {author.username.charAt(0)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{author.username}</p>

            {author.verified && (
              <span className="text-xs text-blue-600">✔</span>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {author.year} • {createdAt}
          </p>
        </div>
      </div>

      <button className="rounded-full p-2 hover:bg-gray-100">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}