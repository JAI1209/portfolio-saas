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
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
