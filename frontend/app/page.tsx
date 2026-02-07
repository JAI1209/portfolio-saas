import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">Portfolio SaaS</div>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link className="hover:text-white" href="/portfolios">
              Portfolios
            </Link>
            <Link
              className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-white/30 hover:bg-white/10"
              href="/login"
            >
              Admin Login
            </Link>
          </nav>
        </header>

        <main className="mt-16 grid flex-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Portfolio publishing
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Manage, publish, and showcase portfolios in one clean workflow.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Keep your portfolio catalog organized, publish approved work, and
              let visitors explore your latest highlights without friction.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300"
                href="/portfolios"
              >
                View Public Portfolios
              </Link>
              <Link
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                href="/login"
              >
                Admin Sign In
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/30">
              <h2 className="text-lg font-semibold text-white">Publish faster</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Review portfolio submissions, flip status instantly, and keep
                published work curated.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/80 via-slate-900/40 to-slate-950/90 p-6">
              <h2 className="text-lg font-semibold text-white">Admin ready</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Secure admin routes, role-aware login, and a steady dark UI
                tailored for focus.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
              <h2 className="text-lg font-semibold text-white">Public detail view</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Give each published portfolio a dedicated page with clean
                metadata and descriptions.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
