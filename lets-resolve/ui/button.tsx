import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  /**
   * Size sets height and padding in one place. Passing sizing classes such as
   * "px-0" through className does not work: clsx does not merge Tailwind
   * classes, so the default "px-4" would still win and squash icon buttons.
   */
  size?: "md" | "sm" | "icon" | "icon-sm";
}

const SIZE_CLASSES = {
  md: "h-10 px-4 text-sm",
  sm: "h-9 px-3.5 text-[13px]",
  icon: "h-9 w-9 p-0",
  "icon-sm": "h-8 w-8 p-0",
} as const;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        SIZE_CLASSES[size],
        variant === "primary" &&
          "bg-buttons text-white shadow-sm hover:bg-buttons-hover active:scale-[0.98]",
        variant === "ghost" &&
          "bg-transparent text-typography hover:bg-shadow active:scale-[0.98]",
        className
      )}
    >
      {children}
    </button>
  );
}
