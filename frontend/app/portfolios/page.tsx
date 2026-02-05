import { fetchAllPortfoliosAdmin } from "@/app/lib/adminApi";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!; // dev-only

export default async function AdminPortfoliosPage() {
  const data = await fetchAllPortfoliosAdmin(ADMIN_TOKEN);
  const portfolios = data.portfolios || [];

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin · Portfolios</h1>

      {portfolios.length === 0 ? (
        <p className="text-gray-500">No portfolios found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-3">Title</th>
                <th className="border p-3">Owner</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {portfolios.map((portfolio: any) => (
                <tr key={portfolio._id}>
                  <td className="border p-3 font-medium">
                    {portfolio.title}
                  </td>
                  <td className="border p-3">
                    {portfolio.user?.email || "—"}
                  </td>
                  <td className="border p-3">
                    <StatusBadge status={portfolio.status} />
                  </td>
                  <td className="border p-3">
                    <ActionButtons
                      id={portfolio._id}
                      status={portfolio.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}