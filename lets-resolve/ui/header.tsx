"use client";
import Link from "next/link";
import LogoutForm from "@/ui/dashboard/logout-form";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ThemeButton from "./themeButton";
import Logo from "./logo";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="z-20 flex flex-row items-center justify-between gap-2 border-b border-separator bg-header px-4 py-2.5">
      <Link className="flex items-center rounded-md" href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-1">
        <ThemeButton />
        {isSignedIn && (
          <>
            <Link
              href="/dashboard/profile"
              className={clsx(
                "flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-typography transition-colors hover:bg-shadow md:justify-start",
                {
                  "bg-selected text-accent": pathname === "/dashboard/profile",
                }
              )}
            >
              <UserCircleIcon className="w-5" />
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
                "flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-typography transition-colors hover:bg-shadow md:justify-start",
                { hidden: pathname === "/auth/login" }
              )}
            >
              <UserCircleIcon className="w-5" />
              <p className="hidden md:block font-semibold">Sign In</p>
            </Link>
            <Link
              href="/auth/signup"
              className={clsx(
                "flex h-9 items-center justify-center gap-2 rounded-lg bg-buttons px-3 text-sm font-semibold text-white transition-colors hover:bg-buttons-hover md:justify-start",
                { hidden: pathname === "/auth/signup" }
              )}
            >
              <p>Sign up</p>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
