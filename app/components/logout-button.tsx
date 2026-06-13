"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  label: string;
  loadingLabel: string;
};

export default function LogoutButton({
  label,
  loadingLabel,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="min-h-11 shrink-0 px-1 text-xs font-semibold text-zinc-500 transition hover:text-[#d71920] disabled:opacity-60"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
