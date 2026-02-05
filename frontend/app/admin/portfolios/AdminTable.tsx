"use client";

import { useState } from "react";
import { ActionButton } from "./ActionButton";

export default function AdminTable({
  initialPortfolios,
}: {
  initialPortfolios: any[];
}) {
  const [portfolios, setPortfolios] = useState(initialPortfolios);

  const updateStatus = (id: string, newStatus: "draft" | "published") => {
    setPortfolios((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, status: newStatus } : p
      )
    );
  };

  if (portfolios.length === 0) {
    return <p className="text-gray-500">No portfolios found.</p>;
  }

  return (
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
          {portfolios.map((portfolio) => (
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
                  onStatusChange={(newStatus) =>
                    updateStatus(portfolio._id, newStatus)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Status Badge ---------- */

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