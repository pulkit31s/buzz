"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { ContentEditor } from "./ContentEditor";
import { ImageUploader } from "./ImageUploader";
import { PollCreator } from "./PollCreator";
import { TagSelector } from "./TagSelector";
import { SubmitButton } from "./SubmitButton";

import {
    createPostSchema,
    type CreatePostFormValues,
} from "../utils/createPost.schema";

import { useCreatePost } from "../hooks/useCreatePost";

export function CreatePostForm() {
    const methods = useForm<CreatePostFormValues>({
        resolver: zodResolver(createPostSchema),
        mode: "onChange",
        defaultValues: {
            content: "",
            images: [],
            tags: [],
            poll: undefined,
        },
    });

    const {
        handleSubmit,
        reset,
    } = methods;

    const {
        createPost,
        loading,
    } = useCreatePost();

    const router = useRouter();

    async function onSubmit(values: CreatePostFormValues) {
        const response = await createPost(values);

        if (response.success) {
            reset();
            router.push("/feed");
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <ContentEditor />

                <ImageUploader />

                <PollCreator />

                <TagSelector />

                <div className="flex items-center justify-end gap-3 border-t pt-6">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="rounded-lg border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Cancel
                    </button>

                    <SubmitButton loading={loading} />
                </div>
            </form>
        </FormProvider>
    );
}