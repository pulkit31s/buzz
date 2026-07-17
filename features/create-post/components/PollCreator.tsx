"use client";

import { Plus, Trash2, Vote } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import {
  MAX_POLL_OPTIONS,
  MIN_POLL_OPTIONS,
  type CreatePostFormValues,
} from "../utils/createPost.schema";

export function PollCreator() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreatePostFormValues>();

  const [enabled, setEnabled] = useState(false);

  const poll = watch("poll");

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "poll.options",
  });

  useEffect(() => {
    if (enabled && !poll) {
      setValue(
        "poll",
        {
          question: "",
          options: [
            { text: "" },
            { text: "" },
          ],
        },
        {
          shouldDirty: true,
        }
      );
    }
  }, [enabled, poll, setValue]);

  function togglePoll() {
    if (enabled) {
      setEnabled(false);

      setValue("poll", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });

      replace([]);
    } else {
      setEnabled(true);
    }
  }

  function addOption() {
    if (fields.length >= MAX_POLL_OPTIONS) return;

    append({
      text: "",
    });
  }

  return (
    <section className="space-y-3">
      {!enabled ? (
        <button
          type="button"
          onClick={togglePoll}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed p-4 transition-colors hover:bg-muted/40"
        >
          <Vote className="h-5 w-5 text-primary" />

          <span className="font-medium">
            Add Poll
          </span>
        </button>
      ) : (
        <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold">
              <Vote className="h-5 w-5 text-primary" />
              Poll
            </h3>

            <button
              type="button"
              onClick={togglePoll}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <input
            {...register("poll.question")}
            placeholder="Ask a question..."
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />

          {errors.poll?.question && (
            <p className="text-sm text-destructive">
              {errors.poll.question.message}
            </p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2"
              >
                <input
                  {...register(`poll.options.${index}.text`)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />

                {fields.length > MIN_POLL_OPTIONS && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {typeof errors.poll?.options?.message === "string" && (
            <p className="text-sm text-destructive">
              {errors.poll.options.message}
            </p>
          )}

          {fields.length < MAX_POLL_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </button>
          )}
        </div>
      )}
    </section>
  );
}