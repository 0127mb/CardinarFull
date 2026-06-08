import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL } from "../../lib/assets";

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("profileImage");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Profile image is required" },
      { status: 400 },
    );
  }

  const backendForm = new FormData();
  backendForm.set("profileImage", file);

  const response = await fetch(`${API_BASE_URL}/api/User/profile-image`, {
    method: "PATCH",
    body: backendForm,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `access_token=${accessToken}`,
    },
  });

  const text = await response.text();
  const payload = text
    ? (() => {
        try {
          return JSON.parse(text) as unknown;
        } catch {
          return { message: text };
        }
      })()
    : null;

  return NextResponse.json(payload, { status: response.status });
}
