import Link from "next/link";
import { getPublishedPortfolios } from "@/app/lib/api";

export default async function PortfoliosPage() {
  const portfolios = await getPublishedPortfolios();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <Link className="text-sm text-slate-400 hover:text-white" href="/">
              Back to home
            </Link>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Published portfolios
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Discover approved work from the latest teams.
            </p>
          </div>
          <Link
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
            href="/login"
          >
            Admin
          </Link>
        </header>

        <main className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-sm text-slate-300">
              No published portfolios yet. Check back soon.
            </div>
          ) : (
            portfolios.map((portfolio) => (
              <Link
                key={portfolio._id}
                href={`/portfolios/${portfolio._id}`}
                className="group rounded-3xl border border-white/10 bg-slate-950/50 p-6 transition hover:-translate-y-1 hover:border-sky-400/50 hover:bg-slate-900/70 hover:shadow-xl hover:shadow-sky-500/10"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-200">
                    Published
                  </span>
                  <span className="text-xs text-slate-500">
                    {portfolio.user?.name || "Anonymous"}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-white group-hover:text-sky-200">
                  {portfolio.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-300">
                  {portfolio.description || "No description provided."}
                </p>
              </Link>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
