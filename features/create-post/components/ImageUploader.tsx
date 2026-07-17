"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  MAX_IMAGES,
  type CreatePostFormValues,
} from "../utils/createPost.schema";

interface PreviewImage {
  file: File;
  preview: string;
}

export function ImageUploader() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreatePostFormValues>();

  const images = watch("images") ?? [];

  const [previews, setPreviews] = useState<PreviewImage[]>([]);

  useEffect(() => {
    const mapped = images.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(mapped);

    return () => {
      mapped.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) return;

    const updatedImages = [...images, ...selectedFiles].slice(
      0,
      MAX_IMAGES
    );

    setValue("images", updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
    });

    event.target.value = "";
  }

  function removeImage(index: number) {
    const updatedImages = images.filter((_, i) => i !== index);

    setValue("images", updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  return (
    <section className="space-y-3">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <label
          htmlFor="image-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-6 transition-colors hover:bg-muted/40"
        >
          <ImagePlus className="h-5 w-5 text-primary" />

          <div className="text-center">
            <p className="font-medium">
              Upload Images
            </p>

            <p className="text-sm text-muted-foreground">
              Up to {MAX_IMAGES} images
            </p>
          </div>
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {previews.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previews.map((image, index) => (
              <div
                key={`${image.file.name}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border"
              >
                <Image
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {errors.images && (
        <p className="text-sm text-destructive">
          {errors.images.message}
        </p>
      )}
    </section>
  );
}