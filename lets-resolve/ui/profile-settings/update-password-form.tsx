"use client";
import { ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleUpdatePassword } from "@/lib/cognitoActions";

export default function UpdatePasswordForm() {
  const [status, dispatch] = useFormState(handleUpdatePassword, undefined);

  return (
    <form className="card p-6" action={dispatch}>
      <div className="space-y-4">
        <div>
          <label htmlFor="current_password" className="field-label">
            Current password
          </label>
          <div className="relative">
            <input
              id="current_password"
              type="password"
              name="current_password"
              placeholder="Enter current password"
              required
              minLength={6}
              className="peer field-input"
            />
            <KeyIcon className="field-icon" />
          </div>
        </div>
        <div>
          <label htmlFor="new_password" className="field-label">
            New password
          </label>
          <div className="relative">
            <input
              id="new_password"
              type="password"
              name="new_password"
              placeholder="Enter new password"
              required
              minLength={6}
              className="peer field-input"
            />
            <KeyIcon className="field-icon" />
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
            <p>There was an error updating password.</p>
          </div>
        )}
        {status === "success" && (
          <p className="form-success">Password updated successfully.</p>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <UpdateButton />
      </div>
    </form>
  );
}

function UpdateButton() {
  const { pending } = useFormStatus();

  return <Button aria-disabled={pending}>Update password</Button>;
}
