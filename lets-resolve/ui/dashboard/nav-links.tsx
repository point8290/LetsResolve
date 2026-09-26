"use client";
import useAuthUser from "@/app/hooks/use-auth-user";
import {
  TicketIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const user = useAuthUser();
  const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    { name: "Tickets", href: "/dashboard/tickets", icon: TicketIcon },
    {
      name: "Customers",
      href: "/dashboard/customers",
      icon: BuildingOffice2Icon,
    },
    {
      name: "Articles",
      href: "/dashboard/articles",
      icon: DocumentDuplicateIcon,
    },
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
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-10 grow items-center justify-center gap-2.5 rounded-lg p-3 text-sm font-medium text-typography transition-colors hover:bg-shadow md:flex-none md:justify-start md:px-3",
              {
                "bg-selected font-semibold text-accent": isActive,
              }
            )}
          >
            <LinkIcon className="w-5 shrink-0" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
