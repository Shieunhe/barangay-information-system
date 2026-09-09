import type { ButtonProps, ButtonSize, ButtonVariant } from "@/types/button";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-brgy-sidebar text-white hover:bg-brgy-sidebar/90",
  secondary: "border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 rounded-md px-3 text-xs",
  md: "h-10 min-w-[8.75rem] rounded-lg px-5 text-sm shadow-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "sm",
  type = "button",
  className = "",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center font-semibold disabled:cursor-wait disabled:opacity-80 ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        children
      )}
    </button>
  );
}
