import ConfirmSignUpForm from "@/ui/auth/confirm-signup-form";
import React from "react";

export default function SignUp({
  searchParams,
}: {
  searchParams?: { email?: string; sentTo?: string };
}) {
  return (
    <ConfirmSignUpForm
      email={searchParams?.email ?? ""}
      sentTo={searchParams?.sentTo ?? ""}
    />
  );
}
