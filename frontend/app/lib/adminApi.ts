const API_BASE_URL = "http://localhost:5000";

/**
 * =========================
 * ADMIN: FETCH ALL PORTFOLIOS
 * =========================
 */
export async function fetchAllPortfoliosAdmin(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/admin/portfolios`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch portfolios");
  }

  return res.json();
}

/**
 * =========================
 * ADMIN: UPDATE PORTFOLIO STATUS
 * =========================
 */
export async function updatePortfolioStatus(
  id: string,
  status: "draft" | "published",
  token: string
) {
  const res = await fetch(
    `${API_BASE_URL}/api/portfolios/admin/${id}/status`,
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
    const error = await res.json();
    throw new Error(error.message || "Failed to update portfolio status");
  }

  return res.json();
}