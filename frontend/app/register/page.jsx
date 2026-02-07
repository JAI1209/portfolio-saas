"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await registerUser({ email, password });
      setSuccess("Account created. Redirecting to login...");
      setTimeout(() => {
        router.replace("/login");
      }, 800);
    } catch (err) {
      setError(err?.message || "Registration failed");
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
          <Link className="text-sm text-slate-300 hover:text-white" href="/login">
            Sign in
          </Link>
        </header>

        <main className="mt-16 flex flex-1 items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/40"
          >
            <div>
              <h1 className="text-2xl font-semibold text-white">Create account</h1>
              <p className="mt-2 text-sm text-slate-400">
                Register to access the admin dashboard.
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
                  placeholder="you@studio.com"
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
                  placeholder="Create a password"
                  required
                />
              </label>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {success}
              </div>
            ) : null}

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-sky-300/60"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                  Creating...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
