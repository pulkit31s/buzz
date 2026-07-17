"use client";

import { useFormContext } from "react-hook-form";

import { CharacterCounter } from "../components/CharacterCounter";

import {
  MAX_POST_LENGTH,
  type CreatePostFormValues,
} from "../utils/createPost.schema";

export function ContentEditor() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreatePostFormValues>();

  const content = watch("content") ?? "";
  const characterCount = content.length;

  return (
    <section className="space-y-2">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <textarea
          {...register("content")}
          rows={8}
          maxLength={MAX_POST_LENGTH}
          placeholder="Share something with your campus..."
          className="min-h-40 w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground"
        />

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <p className="text-xs text-muted-foreground">
            Your post will be shared anonymously.
          </p>

          <CharacterCounter
            current={characterCount}
            max={MAX_POST_LENGTH}
          />
        </div>
      </div>

      {errors.content && (
        <p className="text-sm text-destructive">
          {errors.content.message}
        </p>
      )}
    </section>
  );
}