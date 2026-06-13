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
import LogoutButton from "./logout-button";

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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-3 px-4 py-3 sm:px-5 md:h-16 md:flex-nowrap md:gap-6 md:py-0">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/header/lc.png"
            alt="CARDINAR"
            width={132}
            height={26}
            priority
            className="h-auto w-28 sm:w-[132px]"
          />
        </Link>

        <form
          action="/catalog"
          className="order-3 flex w-full items-center md:order-none md:w-auto md:flex-1"
        >
          <input
            name="q"
            placeholder={t.search}
            className="h-11 min-w-0 flex-1 rounded-l-md bg-zinc-100 px-3 text-base text-zinc-900 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-zinc-400 sm:px-4 sm:text-sm"
          />
          <button className="h-11 shrink-0 rounded-r-md bg-[#1f1f1f] px-4 text-sm font-semibold text-white sm:px-5">
            {t.searchButton}
          </button>
        </form>

        <div className="flex min-w-0 items-center gap-2 text-sm sm:gap-4 lg:gap-5">
          {staticInfo?.phoneNumber ? (
            <a
              href={`tel:${staticInfo.phoneNumber.replace(/\s+/g, "")}`}
              className="hidden font-semibold text-zinc-900 lg:block"
            >
              {staticInfo.phoneNumber}
            </a>
          ) : null}
          <Link
            href="/checkout"
            aria-label={t.cart}
            className="icon-link flex min-h-11 items-center px-1 font-semibold"
          >
            <span>{t.cart}</span>
          </Link>
          {currentUser ? (
            <>
              <Link
                href="/profile"
                aria-label={t.profile}
                className="flex min-h-11 min-w-0 items-center gap-2 text-zinc-900"
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
              <LogoutButton
                label={lang === "uz" ? "Chiqish" : "Выйти"}
                loadingLabel={lang === "uz" ? "Chiqilmoqda..." : "Выход..."}
              />
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/features/authentication"
                aria-label={t.profile}
                className="flex min-h-11 items-center font-semibold text-[#d71920]"
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
