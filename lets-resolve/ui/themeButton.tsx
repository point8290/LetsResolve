"use client";

import { changeTheme } from "@/utils/themeHelper";
import { MouseEventHandler, useState } from "react";
import { MoonIcon } from "@heroicons/react/24/solid";
export default function ThemeButton() {
  const [theme, setTheme] = useState("light");
  const themeChangeHandler: MouseEventHandler<HTMLButtonElement> = () => {
    if (theme == "dark") {
      changeTheme("light");
      setTheme("light");
    } else {
      changeTheme("dark");
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={themeChangeHandler}
      className="flex h-[30px] text-white grow  items-center justify-center gap-2 rounded-md  p-3 text-sm font-medium  md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <MoonIcon className={`w-6`} color={theme == "dark" ? "white" : "black"} />
    </button>
  );
}
