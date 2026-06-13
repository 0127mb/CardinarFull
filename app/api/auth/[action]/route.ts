import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "../../../lib/assets";

type RouteContext = {
  params: Promise<{ action: string }>;
};

function errorMessage(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "message" in data
  ) {
    const message = (data as { message?: string | string[] }).message;
    return Array.isArray(message) ? message.join(", ") : message ?? fallback;
  }

  return fallback;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { action } = await context.params;

  if (action === "logout") {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        cache: "no-store",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
              Cookie: `access_token=${accessToken}`,
            }
          : undefined,
      });
    } catch {
      // The local session must still be cleared when the API is unavailable.
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
    return response;
  }

  if (action !== "register" && action !== "login") {
    return NextResponse.json({ message: "Unknown auth action" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(
      `${API_BASE_URL}/api/auth/${action}`,
      {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const data = (await backendResponse.json().catch(() => null)) as unknown;

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message: errorMessage(
            data,
            action === "register"
              ? "Registration failed"
              : "Login failed",
          ),
        },
        { status: backendResponse.status },
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      { message: "Authentication service is unavailable" },
      { status: 502 },
    );
  }
}
