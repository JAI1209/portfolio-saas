import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const parseJsonSafe = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json({ message: "Missing API URL" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Registration failed" },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
