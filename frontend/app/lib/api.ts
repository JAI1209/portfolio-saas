// frontend/app/lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchPublicPortfolios() {
  const res = await fetch(
    `${API_BASE_URL}/api/portfolios/public`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch public portfolios");
  }

  const data = await res.json();

  // 🔑 normalize API response
  return data.portfolios ?? [];
}




// ADMIN: fetch all portfolios
export async function fetchAllPortfoliosAdmin(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/portfolios/admin`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch admin portfolios");
  }

  return res.json();
}

// ADMIN: update portfolio status
export async function updatePortfolioStatus(
  id: string,
  status: "draft" | "published",
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/portfolios/admin/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  return res.json();
}



export async function fetchPublicPortfolioById(id: string) {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const res = await fetch(
    `${API_BASE_URL}/api/portfolios/public/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch portfolio");
  }

  return res.json();
}
