import { LogoMark } from "@/ui/logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen bg-primary">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0b3a30] p-10 text-white lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"
        />

        <div className="relative z-10 flex items-center gap-2">
          <LogoMark tone="inverse" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Let&apos;s Resolve
          </span>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-display text-3xl italic leading-snug text-white/95">
            Every ticket answered. Every customer known.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            A support desk and lightweight CRM for teams who take follow-through
            seriously — tickets, customers, and the history between them, in one
            place.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} Let&apos;s Resolve
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-16 lg:w-1/2">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </main>
  );
}
