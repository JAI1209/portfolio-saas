import { NextResponse } from "next/server";

const clearCookies = (response: NextResponse) => {
  response.cookies.set({
    name: "auth_token",
    value: "",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set({
    name: "user_name",
    value: "",
    maxAge: 0,
    path: "/",
  });
};

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearCookies(response);
  return response;
}

export async function GET() {
  const response = NextResponse.json({ ok: true });
  clearCookies(response);
  return response;
}
