"use client";

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleSignUp } from "@/lib/cognitoActions";
import Link from "next/link";

export default function SignUpForm() {
  const [errorMessage, dispatch] = useFormState(handleSignUp, undefined);
  return (
    <form action={dispatch}>
      <div className="card px-7 pb-7 pt-8">
        <h1 className="font-display text-2xl font-semibold text-typography">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted">
          Set up tickets, customers, and your knowledge base in minutes.
        </p>
        <div className="mt-6 w-full space-y-4">
          <div>
            <label className="field-label" htmlFor="name">
              Name
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="name"
                type="text"
                name="name"
                minLength={4}
                placeholder="Enter your name"
                required
              />
              <UserCircleIcon className="field-icon" />
            </div>
          </div>
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
        <SignUpButton />
        <div className="mt-4 flex justify-center">
          <Link
            href="/auth/login"
            className="text-sm text-muted hover:text-typography"
          >
            Already have an account?{" "}
            <span className="font-medium text-accent">Log in</span>
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

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      Create account
      <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
