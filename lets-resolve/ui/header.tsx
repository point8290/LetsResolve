"use client";
import Link from "next/link";
import LogoutForm from "@/ui/dashboard/logout-form";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="flex px-2 py-0 items-center bg-[#3c3c3c] grow flex-row justify-between space-x-2">
      <Link
        className="mb-2 flex  items-end justify-start rounded-md  p-4"
        href="/"
      >
        <div className="w-32 text-white md:w-40">Let's Resolve</div>
      </Link>
      <div className="flex">
        {isSignedIn && (
          <>
            <Link
              href="/dashboard/profile"
              className={clsx(
                "flex h-35px] grow items-center justify-center gap-2 rounded-md bg-[#3a3a3a] px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-sky-100 text-blue-600": pathname === "/dashboard/profile",
                }
              )}
            >
              <UserCircleIcon className="w-6" />
              <p className="hidden md:block">Profile</p>
            </Link>
            <LogoutForm />
          </>
        )}
        {!isSignedIn && (
          <>
            <Link
              href="/auth/login"
              className={clsx(
                "flex h-35px] grow items-center justify-center gap-2 rounded-md bg-[#3a3a3a] px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  hidden: pathname === "/auth/login",
                }
              )}
            >
              <UserCircleIcon className="w-6" />
              <p className="hidden md:block">Sign In</p>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
