import Image from "next/image";
import Link from "next/link";
import {
  assetUrl,
  getCurrentLanguage,
  getCurrentUser,
  getStaticShell,
  uiText,
} from "../lib/api";
import LanguageSwitcher from "./language-switcher";

const DEFAULT_PROFILE_IMAGE = "https://github.com/identicons/cardinar-user.png";

export default async function SiteHeader() {
  const lang = await getCurrentLanguage();
  const [{ staticInfo }, currentUser] = await Promise.all([
    getStaticShell(lang),
    getCurrentUser(),
  ]);
  const t = uiText[lang];
  const profileImage = currentUser?.profileImage
    ? assetUrl(currentUser.profileImage)
    : DEFAULT_PROFILE_IMAGE;

  return (
    <header className="w-full border-b border-zinc-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/header/lc.png"
            alt="CARDINAR"
            width={132}
            height={26}
            priority
          />
        </Link>

        <form action="/catalog" className="hidden flex-1 items-center md:flex">
          <input
            name="q"
            placeholder={t.search}
            className="h-10 flex-1 rounded-l-md bg-zinc-100 px-4 text-sm text-zinc-900 outline-none"
          />
          <button className="h-10 rounded-r-md bg-[#1f1f1f] px-5 text-sm font-semibold text-white">
            {t.searchButton}
          </button>
        </form>

        <div className="flex items-center gap-5 text-sm">
          {staticInfo?.phoneNumber ? (
            <a
              href={`tel:${staticInfo.phoneNumber.replace(/\s+/g, "")}`}
              className="hidden font-semibold text-zinc-900 lg:block"
            >
              {staticInfo.phoneNumber}
            </a>
          ) : null}
          <Link href="/checkout" aria-label={t.cart} className="icon-link">
            <span>{t.cart}</span>
          </Link>
          {currentUser ? (
            <Link
              href="/profile"
              aria-label={t.profile}
              className="flex min-w-0 items-center gap-2 text-zinc-900"
            >
              <Image
                src={profileImage}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 rounded-full border border-zinc-200 object-cover"
              />
              <span className="hidden max-w-32 truncate font-semibold sm:block">
                {currentUser.fullName}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/features/authentication"
                aria-label={t.profile}
                className="text-[#d71920]"
              >
                {t.login}
              </Link>
              <Link
                href="/features/authentication"
                className="hidden rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 sm:inline-block"
              >
                {t.register}
              </Link>
            </div>
          )}
          <LanguageSwitcher language={lang} />
        </div>
      </div>
    </header>
  );
}
