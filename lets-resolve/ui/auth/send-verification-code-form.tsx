"use client";

import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { handleSendEmailVerificationCode } from "@/lib/cognitoActions";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../button";

export default function SendVerificationCode() {
  const [response, dispatch] = useFormState(handleSendEmailVerificationCode, {
    message: "",
    errorMessage: "",
  });
  const { pending } = useFormStatus();
  return (
    <>
      {/* formNoValidate: the code field is required, but resending is exactly
          the case where the user does not have a code yet. */}
      <Button
        variant="ghost"
        className="mt-3 w-full border border-separator"
        aria-disabled={pending}
        formAction={dispatch}
        formNoValidate
      >
        <ArrowPathIcon className="h-4 w-4" />
        Resend verification code
      </Button>
      <div
        className="mt-3 flex min-h-[20px] items-center"
        aria-live="polite"
        aria-atomic="true"
      >
        {response?.errorMessage && (
          <div className="form-error">
            <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
            <p>{response.errorMessage}</p>
          </div>
        )}
        {response?.message && <p className="form-success">{response.message}</p>}
      </div>
    </>
  );
}
