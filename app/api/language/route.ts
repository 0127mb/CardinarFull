import { NextResponse } from "next/server";
import { LANGUAGE_COOKIE, Language } from "../../lib/language";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    language?: Language;
  } | null;
  const language = body?.language === "uz" ? "uz" : "ru";
  const response = NextResponse.json({ language });

  response.cookies.set(LANGUAGE_COOKIE, language, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
