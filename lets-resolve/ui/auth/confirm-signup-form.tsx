"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleConfirmSignUp } from "@/lib/cognitoActions";
import SendVerificationCode from "./send-verification-code-form";
import { useAuth } from "@/app/context/AuthContext";

export default function ConfirmSignUpForm({
  email = "",
  sentTo = "",
}: {
  email?: string;
  sentTo?: string;
}) {
  const { setIsSignedIn } = useAuth();
  const [errorMessage, dispatch] = useFormState(
    async (prevState: string | undefined, formData: FormData) =>
      await handleConfirmSignUp(prevState, formData, setIsSignedIn),
    undefined
  );

  return (
    <form action={dispatch}>
      <div className="card px-7 pb-7 pt-8">
        <h1 className="font-display text-2xl font-semibold text-typography">
          Confirm your account
        </h1>
        {sentTo && (
          <p className="mt-1 text-sm text-muted">
            We sent a confirmation code to <strong className="text-typography">{sentTo}</strong>.
          </p>
        )}
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
                defaultValue={email}
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="field-icon" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="code">
              Code
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
        <ConfirmButton />
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
        <SendVerificationCode />
      </div>
    </form>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      Confirm <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
