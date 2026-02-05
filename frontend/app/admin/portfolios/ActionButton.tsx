"use client";

import { updatePortfolioStatus } from "@/lib/adminApi";
import { useTransition } from "react";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;

export function ActionButton({
  id,
  status,
  onStatusChange,
}: {
  id: string;
  status: "draft" | "published";
  onStatusChange: (newStatus: "draft" | "published") => void;
}) {
  const [isPending, startTransition] = useTransition();

  const toggleStatus = () => {
    const nextStatus =
      status === "draft" ? "published" : "draft";

    startTransition(async () => {
      await updatePortfolioStatus(id, nextStatus, ADMIN_TOKEN);
      onStatusChange(nextStatus);
    });
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={isPending}
      className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
    >
      {isPending
        ? "Updating..."
        : status === "draft"
        ? "Publish"
        : "Unpublish"}
    </button>
  );
}