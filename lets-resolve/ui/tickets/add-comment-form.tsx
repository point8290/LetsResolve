"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRef } from "react";
import { handleCommentCreate } from "@/lib/commentAction";
import { Button } from "../button";
import { ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

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
    <form ref={formRef} action={dispatch} className="mt-4 space-y-2 border-t border-separator pt-4">
      <textarea
        name="body"
        required
        minLength={1}
        placeholder="Add a comment…"
        rows={2}
        className="field-textarea"
      />
      <div className="flex items-center justify-between">
        <SubmitButton />
        {errorMessage && (
          <div className="form-error">
            <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
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
    <Button aria-disabled={pending} className="h-9 px-3.5 text-[13px]">
      Comment
      <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
    </Button>
  );
}
