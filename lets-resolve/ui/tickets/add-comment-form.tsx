"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRef } from "react";
import { handleCommentCreate } from "@/lib/commentAction";
import { Button } from "../button";
import { ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function AddCommentForm({ ticketId }: { ticketId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errorMessage, dispatch] = useFormState(
    async (prevState: string | undefined, formData: FormData) => {
      const result = await handleCommentCreate(prevState, formData, ticketId);
      if (!result) {
        formRef.current?.reset();
      }
      return result;
    },
    undefined
  );

  return (
    <form ref={formRef} action={dispatch} className="mt-3 space-y-2">
      <textarea
        name="body"
        required
        minLength={1}
        placeholder="Add a comment..."
        className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500"
        rows={2}
      />
      <div className="flex items-center justify-between">
        <SubmitButton />
        {errorMessage && (
          <div className="flex items-center gap-1 text-sm text-red-500">
            <ExclamationCircleIcon className="h-4 w-4" />
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button aria-disabled={pending}>
      Comment
      <ArrowRightIcon className="ml-2 h-4 w-4" />
    </Button>
  );
}
