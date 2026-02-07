import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  if (!API_URL) {
    return NextResponse.json({ message: "Missing API URL" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${API_URL}/api/portfolios`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to fetch portfolios" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json({ message: "Missing API URL" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const response = await fetch(`${API_URL}/api/portfolios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    body: JSON.stringify({
      title: body.title,
      description: body.description,
      status: body.status,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Failed to create portfolio" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
