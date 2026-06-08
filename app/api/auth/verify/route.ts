import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "../../../lib/api";

type VerifyResponse = {
  accessToken?: string;
};

function verificationPage(request: NextRequest, error: string) {
  const url = new URL("/features/authentication/verify", request.url);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  const type = request.nextUrl.searchParams.get("type")?.trim();

  if (!token || (type !== "register" && type !== "login")) {
    return verificationPage(request, "invalid_link");
  }

  try {
    const backendUrl = new URL(`${API_BASE_URL}/api/auth/verify`);
    backendUrl.searchParams.set("token", token);
    backendUrl.searchParams.set("type", type);

    const backendResponse = await fetch(backendUrl, {
      cache: "no-store",
    });
    const data = (await backendResponse.json().catch(() => null)) as
      | VerifyResponse
      | null;

    if (!backendResponse.ok || !data?.accessToken) {
      return verificationPage(request, "verification_failed");
    }

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return verificationPage(request, "service_unavailable");
  }
}
