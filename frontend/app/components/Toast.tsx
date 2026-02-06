type ToastProps = {
  message: string | null;
  variant?: "success" | "error";
};

export default function Toast({ message, variant = "success" }: ToastProps) {
  if (!message) {
    return null;
  }

  const classes =
    variant === "success"
      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100"
      : "border-rose-500/40 bg-rose-500/15 text-rose-100";

  return (
    <div className={`fixed right-6 top-6 z-50 rounded-2xl border px-4 py-3 text-sm shadow-xl ${classes}`}>
      {message}
    </div>
  );
}
