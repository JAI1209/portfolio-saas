import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!API_URL) {
    return NextResponse.json({ message: "Missing API URL" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.status) {
    return NextResponse.json({ message: "Missing status" }, { status: 400 });
  }

  const response = await fetch(
    `${API_URL}/api/portfolios/admin/${params.id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({ status: body.status }),
    }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to update portfolio status" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
