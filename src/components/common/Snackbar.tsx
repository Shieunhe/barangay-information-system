export function Snackbar({
  message,
  variant = "success",
}: {
  message: string;
  variant?: "success" | "error";
}) {
  return (
    <div className="fixed bottom-6 left-6 z-[70] max-w-sm">
      <p
        className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
          variant === "error" ? "bg-red-600" : "bg-emerald-600"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
