import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const parseJsonSafe = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const extractToken = (setCookie: string | null) => {
  if (!setCookie) {
    return null;
  }

  const match = setCookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

export async function POST(request: Request) {
  if (!API_URL) {
    return NextResponse.json({ message: "Missing API URL" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
  }

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    return NextResponse.json(
      { message: data?.message || "Login failed" },
      { status: response.status }
    );
  }

  const cookieHeaders =
    "getSetCookie" in response.headers
      ? response.headers.getSetCookie()
      : [];

  const candidateCookie =
    cookieHeaders.find((cookie) => cookie.includes("token=")) ||
    response.headers.get("set-cookie");

  const token = extractToken(candidateCookie) || data?.token || null;
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 500 });
  }

  const res = NextResponse.json({ user: data?.user });
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
