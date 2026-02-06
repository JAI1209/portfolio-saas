import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type PortfolioDetail = {
  _id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  createdAt?: string;
  user?: {
    name?: string;
    email?: string;
  };
};

export default async function PortfolioDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!API_URL) {
    throw new Error("Missing API URL");
  }

  const response = await fetch(`${API_URL}/api/portfolios/public/${params.id}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio");
  }

  const portfolio = (await response.json()) as PortfolioDetail;
  const createdAt = portfolio.createdAt
    ? new Date(portfolio.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10">
        <header>
          <Link className="text-sm text-slate-400 hover:text-white" href="/portfolios">
            Back to portfolios
          </Link>
        </header>

        <main className="mt-12 flex-1">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>Published portfolio</span>
              {createdAt ? <span>{createdAt}</span> : null}
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              {portfolio.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {portfolio.description || "No description provided."}
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4 text-sm text-slate-300">
              <p className="font-medium text-white">
                {portfolio.user?.name || "Anonymous"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {portfolio.user?.email || "Contact not shared"}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
