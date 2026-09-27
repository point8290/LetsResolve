import SideNav from "@/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-56">
        <SideNav />
      </div>
      <div className="flex-grow overflow-y-auto px-4 md:px-8">{children}</div>
    </div>
  );
}
