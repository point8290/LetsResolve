"use client";
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import {
  handleConfirmUserAttribute,
  handleUpdateUserAttribute,
} from "@/lib/cognitoActions";
import useAuthUser from "@/app/hooks/use-auth-user";

export default function UpdateEmailForm() {
  const user = useAuthUser();
  const [status, dispatch] = useFormState(handleUpdateUserAttribute, "");
  const [confirmStatus, dispatchConfirm] = useFormState(
    handleConfirmUserAttribute,
    undefined
  );

  return (
    <form className="card p-6" action={dispatch}>
      <div className="space-y-4">
        <div>
          <label htmlFor="current_email" className="field-label">
            Current email
          </label>
          <div className="relative">
            <input
              className="peer field-input"
              id="current_email"
              disabled
              name="current_email"
              defaultValue={user?.email}
            />
            <AtSymbolIcon className="field-icon" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            New email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              defaultValue={user?.email}
              className="peer field-input"
            />
            <AtSymbolIcon className="field-icon" />
          </div>
        </div>
      </div>

      <div
        className="mt-3 flex min-h-[20px] items-center"
        aria-live="polite"
        aria-atomic="true"
      >
        {status === "error" && (
          <div className="form-error">
            <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
            <p>There was an error updating email.</p>
          </div>
        )}
        {status === "success" && (
          <p className="form-success">Email has been updated successfully.</p>
        )}
      </div>

      {status?.includes("code") && (
        <>
          <div className="mt-2">
            <label htmlFor="code" className="field-label">
              {status}
            </label>
            <div className="relative">
              <input
                id="code"
                type="text"
                name="code"
                placeholder="Enter code to verify email"
                required
                minLength={6}
                className="peer field-input"
              />
              <KeyIcon className="field-icon" />
            </div>
          </div>
          <div
            className="mt-3 flex min-h-[20px] items-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {confirmStatus === "error" && (
              <div className="form-error">
                <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                <p>There was an error verifying your email</p>
              </div>
            )}
            {confirmStatus === "success" && (
              <p className="form-success">Email verified successfully</p>
            )}
          </div>
        </>
      )}

      <div className="mt-4 flex justify-center gap-3">
        {status?.includes("code") ? (
          <VerifyButton dispatch={dispatchConfirm} />
        ) : (
          <UpdateButton />
        )}
      </div>
    </form>
  );
}

function UpdateButton() {
  const { pending } = useFormStatus();

  return <Button aria-disabled={pending}>Update email</Button>;
}

function VerifyButton({ dispatch }: { dispatch: (payload: FormData) => void }) {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} formAction={dispatch}>
      Verify email
    </Button>
  );
}
