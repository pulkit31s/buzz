"use client";

import { Loader2, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
}

export function SubmitButton({
  loading = false,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading || disabled}
      className="min-w-36"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <SendHorizontal className="mr-2 h-4 w-4" />
          Publish
        </>
      )}
    </Button>
  );
}