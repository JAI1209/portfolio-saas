const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export type PublicPortfolio = {
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

type PublicListResponse = {
  count: number;
  portfolios: PublicPortfolio[];
};

const parseJsonSafe = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export async function getPublishedPortfolios(): Promise<PublicPortfolio[]> {
  const response = await fetch(`${API_URL}/api/portfolios/public`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await parseJsonSafe(response);
    const message = data?.message || "Failed to fetch portfolios";
    throw new Error(message);
  }

  const data = (await response.json()) as PublicListResponse;
  return data.portfolios ?? [];
}

export async function getPublishedPortfolioById(
  id: string
): Promise<PublicPortfolio> {
  const response = await fetch(`${API_URL}/api/portfolios/public/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await parseJsonSafe(response);
    const message = data?.message || "Failed to fetch portfolio";
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as PublicPortfolio;
}
