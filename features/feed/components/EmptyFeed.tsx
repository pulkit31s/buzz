import { SearchX } from "lucide-react";

interface EmptyFeedProps {
  title?: string;
  description?: string;
}

export default function EmptyFeed({
  title = "No posts yet",
  description = "Be the first to start a conversation on Buzz.",
}: EmptyFeedProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-8 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
        <SearchX className="h-8 w-8 text-blue-600" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}