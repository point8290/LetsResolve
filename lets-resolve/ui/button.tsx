import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}

export function Button({
  children,
  className,
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
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
