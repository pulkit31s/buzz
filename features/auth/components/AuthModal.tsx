"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Sparkles, Shield, Lock, Mail, User, BookOpen, Hash } from "lucide-react";

export function AuthModal() {
  const { isModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [year, setYear] = useState("Sophomore");
  const [branch, setBranch] = useState("Computer Science");

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "login") {
        await login({ email, password });
      } else {
        await register({
          collegeId,
          email,
          password,
          username,
          year,
          branch,
        });
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all border border-neutral-100">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-inner">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            {tab === "login" ? "Welcome back to Buzz" : "Join Anonymous Campus"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {tab === "login"
              ? "Sign in to post anonymously, vote on polls, and chat."
              : "Get assigned your unique Anonymous Animal identity today."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-neutral-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === "login"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(null); }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              tab === "register"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "register" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    College ID
                  </label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      required
                      minLength={3}
                      placeholder="e.g. 2024CS101"
                      value={collegeId}
                      onChange={(e) => setCollegeId(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Handle / Username <span className="text-[10px] font-normal text-neutral-400">(letters/numbers/_)</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={30}
                      placeholder="e.g. campus_dev"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 px-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Grad Student">Grad Student</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Department / Branch
                  </label>
                  <div className="relative">
                    <BookOpen size={16} className="absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS / ECE"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Campus Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-700">
                Password
              </label>
              {tab === "register" && (
                <span className="text-[10px] text-neutral-400">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type="password"
                required
                minLength={tab === "register" ? 6 : 1}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-all"
          >
            {loading ? "Authenticating..." : tab === "login" ? "Sign In" : "Claim Anonymous Badge & Join"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-neutral-400 border-t pt-4">
          <Shield size={14} className="text-blue-500" />
          <span>Your identity is always protected & randomized across campus.</span>
        </div>
      </div>
    </div>
  );
}
