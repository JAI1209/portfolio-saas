import { fetchAllPortfoliosAdmin } from "@/lib/adminApi";
import { ActionButton } from "./ActionButton";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!; // dev only

export default async function AdminPortfoliosPage() {
  const data = await fetchAllPortfoliosAdmin(ADMIN_TOKEN);
  const portfolios = data.portfolios || [];

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard · Portfolios
      </h1>

      {portfolios.length === 0 ? (
        <p className="text-gray-500">No portfolios found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Title</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {portfolios.map((portfolio: any) => (
                <tr key={portfolio._id}>
                  <td className="border p-3 font-medium">
                    {portfolio.title}
                  </td>

                  <td className="border p-3">
                    <StatusBadge status={portfolio.status} />
                  </td>

                  <td className="border p-3">
                    <ActionButton
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

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        status === "published"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
}