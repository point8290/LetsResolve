export function LogoMark({
  className = "",
  tone = "brand",
}: {
  className?: string;
  tone?: "brand" | "inverse";
}) {
  const isInverse = tone === "inverse";
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <rect
        width="26"
        height="26"
        rx="8"
        fill={isInverse ? "rgba(255,255,255,0.16)" : "rgb(var(--color-accent))"}
      />
      <path
        d="M7.5 13.2 11 16.7 18.5 9.2"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="font-display text-lg font-semibold tracking-tight text-typography">
        Let&apos;s Resolve
      </span>
    </span>
  );
}
