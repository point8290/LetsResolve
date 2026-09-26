import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function AdminArea() {
  return (
    <main className="mx-auto w-full max-w-4xl py-8">
      <h1 className="font-display text-2xl font-semibold text-typography">
        Admin area
      </h1>
      <p className="mt-1 text-sm text-muted">
        Restricted to the Admins group — settings that affect every user.
      </p>
      <div className="card mt-6 flex flex-col items-center gap-2 p-10 text-center text-muted">
        <ShieldCheckIcon className="h-8 w-8" />
        <p className="text-sm">Nothing here yet.</p>
      </div>
    </main>
  );
}
