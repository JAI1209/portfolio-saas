"use client";

import ActionButton from "./ActionButton";
import StatusBadge from "./StatusBadge";
import type { AdminPortfolio } from "@/app/lib/adminApi";

type AdminTableProps = {
  portfolios: AdminPortfolio[];
  busyId: string | null;
  onToggleStatus: (portfolio: AdminPortfolio) => void;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AdminTable({
  portfolios,
  busyId,
  onToggleStatus,
}: AdminTableProps) {
  if (portfolios.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
        No portfolios yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl shadow-black/40">
      <div className="grid grid-cols-12 gap-4 border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className="col-span-4">Portfolio</span>
        <span className="col-span-3">Owner</span>
        <span className="col-span-2">Status</span>
        <span className="col-span-2">Created</span>
        <span className="col-span-1 text-right">Action</span>
      </div>
      <div className="divide-y divide-white/5">
        {portfolios.map((portfolio) => {
          const isBusy = busyId === portfolio._id;
          const action = portfolio.status === "published" ? "unpublish" : "publish";
          return (
            <div
              key={portfolio._id}
              className="grid grid-cols-12 items-center gap-4 px-6 py-4 text-sm text-slate-200"
            >
              <div className="col-span-4">
                <p className="font-medium text-white">{portfolio.title}</p>
                <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                  {portfolio.description || "No description"}
                </p>
              </div>
              <div className="col-span-3 text-sm text-slate-300">
                <p className="font-medium text-white">
                  {portfolio.user?.name || "Unknown"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {portfolio.user?.email || "No email"}
                </p>
              </div>
              <div className="col-span-2">
                <StatusBadge status={portfolio.status} />
              </div>
              <div className="col-span-2 text-xs text-slate-400">
                {formatDate(portfolio.createdAt)}
              </div>
              <div className="col-span-1 flex justify-end">
                <ActionButton
                  action={action}
                  onClick={() => onToggleStatus(portfolio)}
                  disabled={isBusy}
                  isLoading={isBusy}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
