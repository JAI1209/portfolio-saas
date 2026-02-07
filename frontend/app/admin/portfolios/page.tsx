"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminTable from "./AdminTable";
import Toast from "@/app/components/Toast";
import {
  AdminPortfolio,
  createPortfolio,
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

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

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const created = await createPortfolio({
        title: title.trim(),
        description: description.trim() || undefined,
        status: "draft",
      });

      setPortfolios((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");
      setSuccess("Portfolio created.");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create portfolio";
      setError(message);
    } finally {
      setCreating(false);
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
          <form
            onSubmit={handleCreate}
            className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6"
          >
            <div className="text-sm font-semibold text-white">Create portfolio</div>
            <input
              className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition focus:border-sky-400/60 focus:ring-2"
              placeholder="Portfolio title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <textarea
              className="min-h-[110px] rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition focus:border-sky-400/60 focus:ring-2"
              placeholder="Optional description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <button
              className="w-fit rounded-full bg-sky-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-sky-300/60"
              type="submit"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create draft"}
            </button>
          </form>

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
