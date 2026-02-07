"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/src/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
