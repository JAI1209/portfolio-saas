"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "@/app/lib/adminApi";
import Toast from "@/app/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSession()
      .then((user) => {
        if (!mounted || !user) {
          return;
        }
        if (user.role === "admin") {
          router.replace("/admin/portfolios");
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      setSuccess(true);

      if (data?.user?.role === "admin") {
        router.replace(nextParam || "/admin/portfolios");
      } else {
        router.replace("/portfolios");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <Link className="text-sm text-slate-400 hover:text-white" href="/">
            Back to home
          </Link>
          <Link className="text-sm text-slate-300 hover:text-white" href="/portfolios">
            View portfolios
          </Link>
        </header>

        <main className="mt-16 flex flex-1 items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/40"
          >
            <div>
              <h1 className="text-2xl font-semibold text-white">Admin sign in</h1>
              <p className="mt-2 text-sm text-slate-400">
                Use your admin credentials to manage portfolio publishing.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                Email address
                <input
                  className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition focus:border-sky-400/60 focus:ring-2"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@studio.com"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                Password
                <input
                  className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition focus:border-sky-400/60 focus:ring-2"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  required
                />
              </label>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-sky-300/60"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              Need help? Contact your system administrator.
            </p>
          </form>
        </main>
        <Toast message={error} variant="error" />
        <Toast message={success ? "Signed in. Redirecting..." : null} variant="success" />
      </div>
    </div>
  );
}
