"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleSignIn } from "@/lib/cognitoActions";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
export default function LoginForm() {
  const { setIsSignedIn } = useAuth();

  const [errorMessage, dispatch] = useFormState(
    async (prevState: string | undefined, formData: FormData) =>
      await handleSignIn(prevState, formData, setIsSignedIn),
    undefined
  );

  return (
    <form action={dispatch}>
      <div className="card px-7 pb-7 pt-8">
        <h1 className="font-display text-2xl font-semibold text-typography">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted">Log in to keep things moving.</p>
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
                placeholder="you@company.com"
                required
              />
              <AtSymbolIcon className="field-icon" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
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
        </div>
        <LoginButton />
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <Link
            href="/auth/reset-password/submit"
            className="text-sm font-medium text-accent hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm text-muted hover:text-typography"
          >
            {"Don't have an account? "}
            <span className="font-medium text-accent">Sign up</span>
          </Link>
        </div>
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

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
