import type { ButtonProps, ButtonVariant } from "@/types/button";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-brgy-navy text-white hover:bg-brgy-navy-mid",
  secondary: "border border-brgy-navy/20 bg-white text-brgy-navy hover:bg-brgy-paper",
};

export function Button({
  children,
  variant = "primary",
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
      className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-semibold disabled:cursor-wait disabled:opacity-80 ${variantClass[variant]} ${className}`}
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
