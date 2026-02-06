import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const decodeJwtPayload = (token: string) => {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = decodeJwtPayload(token);
  const role = payload?.role || "user";
  const nameCookie = request.cookies.get("user_name")?.value;
  const name = nameCookie ? decodeURIComponent(nameCookie) : "";

  return NextResponse.json(
    {
      user: {
        name,
        role,
      },
    },
    { status: 200 }
  );
}
