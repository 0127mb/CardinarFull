import Link from "next/link";
import { getCurrentLanguage, getStaticShell, uiText } from "../lib/api";

export default async function SubNavbar() {
  const lang = await getCurrentLanguage();
  const { translation } = await getStaticShell(lang);
  const t = uiText[lang];

  const navItems = [
    { label: translation?.navCatalog ?? t.catalog, href: "/catalog" },
    { label: translation?.navConstructor ?? t.constructor, href: "/constructor" },
    { label: translation?.navBranches ?? t.branches, href: "/branches" },
    { label: translation?.navContacts ?? t.contacts, href: "/contacts" },
  ];

  return (
    <nav className="w-full bg-[#1f1f1f]">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-center gap-10 px-5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-full items-center border-b-2 border-transparent text-xs font-semibold uppercase tracking-wide text-zinc-300 transition hover:border-white hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
