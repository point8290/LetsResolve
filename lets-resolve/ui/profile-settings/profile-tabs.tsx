"use client";
import UpdateProfileForm from "@/ui/profile-settings/update-profile-form";
import UpdatePasswordForm from "@/ui/profile-settings/update-password-form";
import UpdateEmailForm from "@/ui/profile-settings/update-email-form";
import clsx from "clsx";
import { useState } from "react";

const TABS = ["Profile", "Email", "Password"];

export default function ProfilePage() {
  const [tab, setTab] = useState(0);

  return (
    <main className="mx-auto w-full max-w-xl py-8">
      <h1 className="font-display text-2xl font-semibold text-typography">
        Account settings
      </h1>
      <p className="mt-1 text-sm text-muted">
        Manage your profile, email, and password.
      </p>

      <div className="mt-6 inline-flex rounded-lg border border-separator bg-secondary p-1">
        {TABS.map((label, index) => (
          <button
            key={label}
            onClick={() => setTab(index)}
            className={clsx(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === index
                ? "bg-selected text-accent"
                : "text-muted hover:text-typography"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 0 && <UpdateProfileForm />}
        {tab === 1 && <UpdateEmailForm />}
        {tab === 2 && <UpdatePasswordForm />}
      </div>
    </main>
  );
}
