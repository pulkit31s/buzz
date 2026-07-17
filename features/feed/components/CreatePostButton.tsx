"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function CreatePostButton() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const handleClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      router.push("/create-post");
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Create Post"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-blue-600
        text-white
        shadow-lg
        transition-all
        duration-200
        hover:scale-105
        hover:bg-blue-700
        active:scale-95
      "
    >
      <Plus className="h-7 w-7" />
    </button>
  );
}