"use client";

import React from "react";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { AuthModal } from "@/features/auth/components/AuthModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
}
