export default function PortfolioDetailLoading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="mt-12 rounded-3xl border border-white/10 bg-slate-950/60 p-8">
          <div className="h-3 w-40 rounded-full bg-white/10" />
          <div className="mt-4 h-8 w-3/4 rounded-full bg-white/10" />
          <div className="mt-4 h-3 w-full rounded-full bg-white/5" />
          <div className="mt-2 h-3 w-5/6 rounded-full bg-white/5" />
          <div className="mt-8 h-16 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
