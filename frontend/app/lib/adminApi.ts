const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export type AdminPortfolio = {
  _id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  createdAt?: string;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
};

type AdminListResponse = {
  count: number;
  portfolios: AdminPortfolio[];
};

export type SessionUser = {
  name?: string;
  role?: string;
};

export async function getSession(): Promise<SessionUser | null> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const data = await parseJsonSafe(response);
    const message = data?.message || "Failed to fetch session";
    throw new Error(message);
  }

  const data = (await response.json()) as { user?: SessionUser };
  return data.user ?? null;
}

export async function getAdminPortfolios(): Promise<AdminPortfolio[]> {
  const response = await fetch("/api/admin/portfolios", {
    credentials: "include",
  });

  if (!response.ok) {
    const data = await parseJsonSafe(response);
    const message = data?.message || "Failed to fetch admin portfolios";
    throw new Error(message);
  }

  const data = (await response.json()) as AdminListResponse;
  return data.portfolios ?? [];
}

export async function updatePortfolioStatus(
  id: string,
  status: "draft" | "published"
): Promise<AdminPortfolio> {
  const response = await fetch(`/api/admin/portfolios/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
    credentials: "include",
  });

  if (!response.ok) {
    const data = await parseJsonSafe(response);
    const message = data?.message || "Failed to update portfolio status";
    throw new Error(message);
  }

  const data = (await response.json()) as { portfolio: AdminPortfolio };
  return data.portfolio;
}
