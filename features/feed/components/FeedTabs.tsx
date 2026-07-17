"use client";

import { useState } from "react";

const tabs = [
  "For You",
  "Trending",
  "Latest",
  "Confessions",
];

export default function FeedTabs() {
  const [activeTab, setActiveTab] = useState("For You");

  return (
    <div className="sticky top-16 z-40 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
        {tabs.map((tab) => {
          const active = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}