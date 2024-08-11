"use client";
import Link from "next/link";
import LogoutForm from "@/ui/dashboard/logout-form";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ThemeButton from "./themeButton";
import { titleFont } from "./fonts";
import logo from "@/public/logo.png";
import Image from "next/image";
export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="flex px-2 py-0  items-center bg-header grow flex-row justify-between space-x-2">
      <Link className="flex  items-end justify-start rounded-md p-3" href="/">
        <div
          className={`w-32 font-bold flex text-xl md:w-40 ${titleFont.className}`}
        >
          {"Let's Resolve"}
        </div>
      </Link>
      <div className="flex">
        <ThemeButton />
        {isSignedIn && (
          <>
            <Link
              href="/dashboard/profile"
              className={clsx(
                "flex h-[30px] grow hover:bg-shadow items-center hover:opacity-60 justify-center gap-2 rounded-md  px-3 mx-1 text-sm font-medium   md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-selected": pathname === "/dashboard/profile",
                }
              )}
            >
              <UserCircleIcon className="w-6" />
              <p className="hidden md:block font-semibold">Profile</p>
            </Link>
            <LogoutForm />
          </>
        )}
        {!isSignedIn && (
          <>
            <Link
              href="/auth/login"
              className={clsx(
                "flex h-[30px] grow hover:bg-shadow items-center justify-center gap-2 rounded-md px-3 text-sm font-medium hover:opacity-60 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  hidden: pathname === "/auth/login",
                }
              )}
            >
              <UserCircleIcon className="w-6" />
              <p className="hidden md:block font-semibold">Sign In</p>
            </Link>
            <Link
              href="/auth/signup"
              className={clsx(
                "flex h-[30px] grow hover:bg-shadow items-center justify-center gap-2 rounded-md px-3 text-sm font-medium hover:opacity-60 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  hidden: pathname === "/auth/signup",
                }
              )}
            >
              <UserCircleIcon className="w-6" />
              <p className="hidden md:block font-semibold">Sign up</p>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
