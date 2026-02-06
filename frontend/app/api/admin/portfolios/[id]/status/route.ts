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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!API_URL) {
    return NextResponse.json({ message: "Missing API URL" }, { status: 500 });
  }

  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.status) {
    return NextResponse.json(
      { message: "Missing status" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${API_URL}/api/portfolios/admin/${params.id}/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: body.status }),
    }
  );

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to update portfolio status" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
