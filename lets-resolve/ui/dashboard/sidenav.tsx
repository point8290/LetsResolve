"use client";
import NavLinks from "@/ui/dashboard/nav-links";

export default function SideNav() {
  return (
    <div className="flex h-full border-r-[1px] border-separator flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md  md:block"></div>
      </div>
    </div>
  );
}
