"use client";

import {
  AtSymbolIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleResetPassword } from "@/lib/cognitoActions";

export default function SubmitResetPasswordFrom() {
  const [errorMessage, dispatch] = useFormState(handleResetPassword, undefined);
  return (
    <form action={dispatch}>
      <div className="card px-7 pb-7 pt-8">
        <h1 className="font-display text-2xl font-semibold text-typography">
          Reset your password
        </h1>
        <p className="mt-1 text-sm text-muted">
          Enter your email and we&apos;ll send a confirmation code.
        </p>
        <div className="mt-6 w-full">
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="field-icon" />
            </div>
          </div>
        </div>
        <SendConfirmationCodeButton />
        <div
          className="mt-3 flex min-h-[20px] items-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <div className="form-error">
              <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function SendConfirmationCodeButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      Send code <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
