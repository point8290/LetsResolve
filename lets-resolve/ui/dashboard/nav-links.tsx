"use client";
import useAuthUser from "@/app/hooks/use-auth-user";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const user = useAuthUser();
  const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    {
      name: "Articles",
      href: "/dashboard/articles",
      icon: DocumentDuplicateIcon,
    },
    { name: "Tickets", href: "/dashboard/tickets", icon: UserGroupIcon },
  ];

  const pathname = usePathname();

  if (user && user.isAdmin) {
    links.push({
      name: "Admin Area",
      href: "/dashboard/admin",
      icon: BuildingOfficeIcon,
    });
  }
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow hover:bg-shadow items-center justify-center gap-2 rounded-md  p-3 text-sm font-medium hover:opacity-50 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-selected": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
