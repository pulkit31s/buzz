"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, UserCheck, LogIn } from "lucide-react";

export function UserAvatarBar() {
  const { user, loading, openAuthModal, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-full bg-neutral-100 px-4 py-1.5 animate-pulse">
        <div className="h-7 w-7 rounded-full bg-neutral-200" />
        <div className="h-4 w-24 rounded bg-neutral-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
      >
        <LogIn size={14} />
        <span>Sign In / Join</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-3 py-1.5 shadow-sm">
      <div className="flex items-center gap-2">
        {user.anonymousAvatar ? (
          <img
            src={user.anonymousAvatar}
            alt={user.anonymousName}
            className="h-7 w-7 rounded-full bg-blue-50 p-0.5 border border-blue-100"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {user.anonymousName?.charAt(0) || "A"}
          </div>
        )}
        <div className="text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-neutral-800 leading-tight">
              {user.anonymousName || "Anonymous Student"}
            </span>
            <UserCheck size={12} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-medium text-neutral-400 leading-none">
            {user.year} • {user.branch}
          </p>
        </div>
      </div>

      <div className="h-4 w-[1px] bg-neutral-200" />

      <button
        onClick={logout}
        title="Sign Out"
        className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-red-500 transition-colors"
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}
