"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../services/auth.api";
import type { UserProfile, LoginPayload, RegisterPayload } from "../types/auth.types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  isModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    setUser(res.user);
    setIsModalOpen(false);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    setUser(res.user);
    setIsModalOpen(false);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
