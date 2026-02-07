import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  });
  return response;
}
