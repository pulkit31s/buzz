import { CreatePostHeader } from "../components/CreatePostHeader";
import { CreatePostForm } from "../components/CreatePostForm";

export function CreatePost() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-background">
      <CreatePostHeader />

      <section className="flex-1 px-4 py-5 sm:px-6">
        <CreatePostForm />
      </section>
    </main>
  );
}