"use client";

import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleConfirmResetPassword } from "@/lib/cognitoActions";

export default function ConfirmResetPasswordForm() {
  const [errorMessage, dispatch] = useFormState(
    handleConfirmResetPassword,
    undefined
  );
  return (
    <form action={dispatch}>
      <div className="card px-7 pb-7 pt-8">
        <h1 className="font-display text-2xl font-semibold text-typography">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-muted">
          Enter the code we sent you and choose a new password.
        </p>
        <div className="mt-6 w-full space-y-4">
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
          <div>
            <label className="field-label" htmlFor="password">
              New password
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="field-icon" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="code">
              Confirmation code
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="code"
                type="text"
                name="code"
                placeholder="Enter code"
                required
                minLength={6}
              />
              <KeyIcon className="field-icon" />
            </div>
          </div>
        </div>
        <ResetPasswordButton />
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

function ResetPasswordButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      Reset password <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
