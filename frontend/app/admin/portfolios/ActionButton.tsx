"use client";

type ActionButtonProps = {
  action: "publish" | "unpublish";
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function ActionButton({
  action,
  onClick,
  disabled,
  isLoading,
}: ActionButtonProps) {
  const isPublish = action === "publish";
  const label = isLoading
    ? isPublish
      ? "Publishing..."
      : "Unpublishing..."
    : isPublish
      ? "Publish"
      : "Unpublish";

  const baseClasses =
    "rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
  const colorClasses = isPublish
    ? "bg-emerald-400/90 text-slate-950 hover:bg-emerald-300"
    : "bg-amber-400/90 text-slate-950 hover:bg-amber-300";

  return (
    <button
      className={`${baseClasses} inline-flex items-center gap-2 ${colorClasses}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
      ) : null}
      {label}
    </button>
  );
}
