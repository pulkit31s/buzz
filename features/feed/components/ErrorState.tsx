import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load your feed. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-red-200 bg-white px-8 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}