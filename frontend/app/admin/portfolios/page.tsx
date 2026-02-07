"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminTable from "./AdminTable";
import Toast from "@/app/components/Toast";
import {
  AdminPortfolio,
  getAdminPortfolios,
  getSession,
  updatePortfolioStatus,
} from "@/app/lib/adminApi";
import { logoutUser } from "@/src/lib/auth";

export default function AdminPortfoliosPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<AdminPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    let mounted = true;
    getSession()
      .then((user) => {
        if (!mounted) {
          return;
        }
        if (!user) {
          router.replace("/login");
          return;
        }
        if (user.name) {
          setAdminName(user.name);
        }
      })
      .catch(() => {});

    getAdminPortfolios()
      .then((data) => {
        if (mounted) {
          setPortfolios(data);
        }
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to fetch portfolios";
        setError(message);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleToggleStatus = async (portfolio: AdminPortfolio) => {
    if (busyId) {
      return;
    }

    const nextStatus = portfolio.status === "published" ? "draft" : "published";
    setBusyId(portfolio._id);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updatePortfolioStatus(
        portfolio._id,
        nextStatus
      );

      setPortfolios((prev) =>
        prev.map((item) =>
          item._id === portfolio._id
            ? { ...item, status: updated.status }
            : item
        )
      );
      setSuccess(`Portfolio ${updated.status}`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Admin workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Portfolio approvals
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Welcome back, {adminName}.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-white/30 hover:bg-white/10"
              href="/portfolios"
            >
              Public view
            </Link>
            <button
              className="rounded-full border border-white/10 px-4 py-2 text-white transition hover:border-white/30 hover:bg-white/10"
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        <main className="mt-10 flex-1">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
              Loading portfolios...
            </div>
          ) : (
            <AdminTable
              portfolios={portfolios}
              busyId={busyId}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </main>
        <Toast message={error} variant="error" />
        <Toast message={success} variant="success" />
      </div>
    </div>
  );
}
