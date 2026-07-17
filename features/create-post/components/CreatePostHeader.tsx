"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserAvatarBar } from "@/features/auth/components/UserAvatarBar";

export function CreatePostHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Create Post
            </h1>

            <p className="text-xs text-muted-foreground">
              Share something with your campus
            </p>
          </div>
        </div>

        {/* Dynamic Anonymous Identity */}
        <UserAvatarBar />
      </div>
    </header>
  );
}