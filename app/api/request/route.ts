import { NextResponse } from "next/server";
import { apiPost } from "../../lib/api";

export async function POST(request: Request) {
  const form = await request.formData();
  const fullName = String(form.get("fullName") ?? "").trim();
  const phoneNumber = String(form.get("phoneNumber") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const comments = String(form.get("comments") ?? "").trim();

  if (!fullName || !phoneNumber) {
    return NextResponse.json(
      { message: "Full name and phone number are required" },
      { status: 400 },
    );
  }

  const created = await apiPost("/requests", {
    fullName,
    phoneNumber,
    email: email || undefined,
    comments: comments || undefined,
  });

  if (!created) {
    return NextResponse.json(
      { message: "Request could not be sent" },
      { status: 502 },
    );
  }

  return NextResponse.json(created, { status: 201 });
}
