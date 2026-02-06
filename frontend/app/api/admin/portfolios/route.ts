import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const parseJsonSafe = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json({ message: "Missing API URL" }, { status: 500 });
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${API_URL}/api/portfolios/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to fetch admin portfolios" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
