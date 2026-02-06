"use client";

type StatusBadgeProps = {
  status: "draft" | "published";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isPublished = status === "published";
  const classes = isPublished
    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
    : "border-amber-400/40 bg-amber-400/10 text-amber-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {status}
    </span>
  );
}
