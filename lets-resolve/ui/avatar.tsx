// Deterministic, WCAG-AA-checked background/text pairs so initials avatars
// stay legible without needing per-instance contrast tuning.
const PALETTE = [
  { bg: "#0F6B5C", fg: "#FFFFFF" },
  { bg: "#8A4B08", fg: "#FFFFFF" },
  { bg: "#4A3AA7", fg: "#FFFFFF" },
  { bg: "#1D4E89", fg: "#FFFFFF" },
  { bg: "#8B2635", fg: "#FFFFFF" },
  { bg: "#3D5A1F", fg: "#FFFFFF" },
  { bg: "#6B4226", fg: "#FFFFFF" },
  { bg: "#B45309", fg: "#FFFFFF" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "?";

  const namePart = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;
  const words = namePart.split(/[\s._-]+/).filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return namePart.slice(0, 2).toUpperCase();
}

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

export default function Avatar({
  label,
  size = "md",
  className = "",
}: {
  label: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}) {
  const { bg, fg } = PALETTE[hashString(label) % PALETTE.length];

  return (
    <div
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-semibold ${SIZE_CLASSES[size]} ${className}`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {getInitials(label)}
    </div>
  );
}
