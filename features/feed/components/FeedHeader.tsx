import { Bell, Search } from "lucide-react";
import { UserAvatarBar } from "@/features/auth/components/UserAvatarBar";

export default function FeedHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-blue-600">
            Buzz
          </h1>
          <span className="text-xs text-neutral-500">
            VIT Chennai
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <UserAvatarBar />

          <button
            className="rounded-full p-2 transition-colors hover:bg-neutral-100"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-neutral-700" />
          </button>

          <button
            className="relative rounded-full p-2 transition-colors hover:bg-neutral-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-neutral-700" />

            {/* Notification Badge */}
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}