"use client";

import { changeTheme } from "@/utils/themeHelper";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeButton() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    changeTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    changeTheme(next);
    window.localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-typography transition-colors hover:bg-shadow"
    >
      {theme === "dark" ? (
        <SunIcon className="w-5" />
      ) : (
        <MoonIcon className="w-5" />
      )}
    </button>
  );
}
