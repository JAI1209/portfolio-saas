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
    return NextResponse.json(
      { message: "Missing credentials" },
      { status: 400 }
    );
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

  const token = data?.token;
  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 500 });
  }

  const role = data?.user?.role || "user";
  const name = data?.user?.name || "";

  const res = NextResponse.json({
    ok: true,
    user: {
      name,
      role,
    },
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.cookies.set({
    name: "user_name",
    value: encodeURIComponent(name),
    httpOnly: false,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
