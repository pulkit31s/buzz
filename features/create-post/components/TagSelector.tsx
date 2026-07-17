"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  MAX_TAGS,
  POST_TAGS,
  type PostTag,
} from "../constants/tags";
import type { CreatePostFormValues } from "../utils/createPost.schema";

export function TagSelector() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreatePostFormValues>();

  const selectedTags = watch("tags") ?? [];

  function toggleTag(tag: PostTag) {
    const isSelected = selectedTags.includes(tag);

    if (isSelected) {
      setValue(
        "tags",
        selectedTags.filter((t) => t !== tag),
        {
          shouldDirty: true,
          shouldValidate: true,
        }
      );

      return;
    }

    if (selectedTags.length >= MAX_TAGS) {
      return;
    }

    setValue(
      "tags",
      [...selectedTags, tag],
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  }

  return (
    <section className="space-y-3">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Categories
            </h3>

            <p className="text-sm text-muted-foreground">
              Select up to {MAX_TAGS} categories
            </p>
          </div>

          <span className="text-xs text-muted-foreground">
            {selectedTags.length}/{MAX_TAGS}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {POST_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);

            const disabled =
              !isSelected &&
              selectedTags.length >= MAX_TAGS;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={disabled}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                  disabled &&
                    "cursor-not-allowed opacity-50"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {errors.tags && (
        <p className="text-sm text-destructive">
          {errors.tags.message}
        </p>
      )}
    </section>
  );
}