"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/context/AuthContext";

import { handleSignOut } from "@/lib/cognitoActions";

export default function LogoutForm() {
  const { setIsSignedIn } = useAuth();

  return (
    <form action={() => handleSignOut(setIsSignedIn)}>
      <button className="flex h-[30px] w-full hover:bg-shadow hover:opacity-50 grow items-center justify-center gap-2  rounded-md  p-3 text-sm font-medium  md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <div className="hidden  md:block">Sign Out</div>
      </button>
    </form>
  );
}
