import { InboxIcon } from "@heroicons/react/24/outline";

export default function EmptyText({ text }: { text: string }) {
  return (
    <div className="my-6 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-separator py-10 text-muted">
      <InboxIcon className="h-8 w-8" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
