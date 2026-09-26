"use client";
import NavLinks from "@/ui/dashboard/nav-links";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col border-r border-separator bg-header px-3 py-4 md:px-3">
      <div className="flex grow flex-row justify-between gap-1 space-x-2 md:flex-col md:space-x-0 md:space-y-1">
        <NavLinks />
        <div className="hidden h-auto w-full grow md:block"></div>
      </div>
    </div>
  );
}
