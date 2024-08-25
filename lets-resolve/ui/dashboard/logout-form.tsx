"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/context/AuthContext";

import { handleSignOut } from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
  const { setIsSignedIn } = useAuth();
  const router = useRouter();
  const afterSignOut = () => {
    setIsSignedIn(false);
    router.push("/auth/login");
  };

  return (
    <form action={() => handleSignOut(afterSignOut)}>
      <button className="flex h-[30px] w-full hover:bg-shadow hover:opacity-60 grow items-center justify-center gap-2  rounded-md  p-3 text-sm font-medium  md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <div className="hidden  md:block font-semibold">Sign Out</div>
      </button>
    </form>
  );
}
