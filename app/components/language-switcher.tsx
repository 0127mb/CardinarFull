"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Language } from "../lib/language";

const languages: Array<{ label: string; value: Language }> = [
  { label: "RU", value: "ru" },
  { label: "UZ", value: "uz" },
];

export default function LanguageSwitcher({ language }: { language: Language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const router = useRouter();

  async function selectLanguage(nextLanguage: Language) {
    setSelectedLanguage(nextLanguage);
    setIsOpen(false);
    await fetch("/api/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: nextLanguage }),
    });
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-zinc-200 px-2 py-1 text-xs font-semibold uppercase text-zinc-700"
        onClick={() => setIsOpen((value) => !value)}
      >
        {selectedLanguage}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-9 z-20 min-w-24 border border-zinc-200 bg-white py-1 shadow-lg">
          {languages.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`block w-full px-3 py-2 text-left text-xs font-semibold ${
                selectedLanguage === item.value
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-50"
              }`}
              onClick={() => selectLanguage(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
