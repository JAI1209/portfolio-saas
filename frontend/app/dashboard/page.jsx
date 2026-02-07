"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/src/lib/auth";
import { createPortfolio } from "@/app/lib/adminApi";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  useEffect(() => {
    let mounted = true;

    getCurrentUser()
      .then((data) => {
        if (!mounted) return;
        setUser(data?.user || null);
      })
      .catch((err) => {
        if (!mounted) return;
        if (err?.status === 401) {
          router.replace("/login");
          return;
        }
        setError(err?.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logoutUser();
    } catch {
      // Ignore logout errors and still redirect
    } finally {
      router.replace("/login");
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setCreateError("Title is required.");
      return;
    }

    setCreating(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      await createPortfolio({
        title: title.trim(),
        description: description.trim() || undefined,
        status: "draft",
      });
      setTitle("");
      setDescription("");
      setCreateSuccess("Portfolio created. Visit Admin to publish.");
    } catch (err) {
      setCreateError(err?.message || "Failed to create portfolio");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <Link className="text-sm text-slate-400 hover:text-white" href="/">
            Back to home
          </Link>
          <button
            className="text-sm text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:text-slate-500"
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        <main className="mt-12 flex-1">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-300">
              Loading dashboard...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              <form
                onSubmit={handleCreate}
                className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6"
              >
                <div className="text-sm font-semibold text-white">
                  Create portfolio
                </div>
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
                {createError ? (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {createError}
                  </div>
                ) : null}
                {createSuccess ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {createSuccess}
                  </div>
                ) : null}
              </form>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-black/40">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Authenticated
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white">
                Welcome{user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Your session is active and secured by HTTP-only cookies.
              </p>
              {user?.role === "admin" ? (
                <Link
                  className="mt-6 inline-flex w-fit rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
                  href="/admin/portfolios"
                >
                  Go to Admin Dashboard
                </Link>
              ) : null}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
