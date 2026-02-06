export default function PortfoliosLoading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
        <div className="h-8 w-48 rounded-full bg-white/10" />
        <div className="mt-3 h-4 w-64 rounded-full bg-white/5" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-white/10 bg-slate-950/50 p-6"
            >
              <div className="h-3 w-24 rounded-full bg-white/10" />
              <div className="mt-4 h-5 w-40 rounded-full bg-white/10" />
              <div className="mt-3 h-3 w-full rounded-full bg-white/5" />
              <div className="mt-2 h-3 w-5/6 rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
