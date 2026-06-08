import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "../../lib/assets";

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }

  const body = await request.text();
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Cookie: `access_token=${token}`,
    },
    body,
  });
  const text = await response.text();

  return new NextResponse(text || null, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
