"use client";
import { font } from "@/ui/fonts";
import UpdateProfileForm from "@/ui/profile-settings/update-profile-form";
import UpdatePasswordForm from "@/ui/profile-settings/update-password-form";
import UpdateEmailForm from "@/ui/profile-settings/update-email-form";
import { MouseEvent, useState } from "react";

export default function ProfilePage() {
  const [tab, setTab] = useState(0);
  const onTabChange = (e: MouseEvent<HTMLButtonElement>) => {
    setTab(parseInt(e.currentTarget.name));
  };

  return (
    <main className="w-full md:w-2/3 mx-auto py-8">
      <div className="flex rounded items-center mx-2 text-sm md:mx-0 flex-column mb-4">
        <button
          onClick={onTabChange}
          name="0"
          className={`grow py-1 rounded-l-lg bg-selected ${
            tab == 0 ? "opacity-100 font-semibold" : " opacity-50"
          }`}
        >
          Update Profile
        </button>
        <button
          onClick={onTabChange}
          name="1"
          className={`grow py-1 bg-selected ${
            tab == 1 ? "opacity-100 font-semibold" : " opacity-50"
          }`}
        >
          Update Email
        </button>
        <button
          onClick={onTabChange}
          name="2"
          className={`grow py-1 rounded-r-lg bg-selected ${
            tab == 2 ? "opacity-100 font-semibold" : " opacity-50"
          }`}
        >
          Change password
        </button>
      </div>

      <div className="flex flex-col opacity-100 p-2 md:py-4 md:px-8 rounded-lg ">
        <div className="flex items-center flex-col md:flex-row justify-center mb-8 gap-8">
          {tab == 0 && <UpdateProfileForm />}
          {tab == 1 && <UpdateEmailForm />}
          {tab == 2 && <UpdatePasswordForm />}
        </div>
      </div>
    </main>
  );
}
