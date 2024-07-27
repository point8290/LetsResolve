"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/context/AuthContext";

import { handleSignOut } from "@/lib/cognitoActions";

export default function LogoutForm() {
  const { setIsSignedIn } = useAuth();

  return (
    <form action={() => handleSignOut(setIsSignedIn)}>
      <button className="flex h-[48px] w-full text-white grow items-center justify-center gap-2 rounded-md bg-[#3c3c3c] p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6 " />
        <div className="hidden  md:block">Sign Out</div>
      </button>
    </form>
  );
}
