import Image from "next/image";
import Link from "next/link";
import { apiGet, assetUrl, getCurrentLanguage, getStaticShell, SocialLink, uiText } from "../lib/api";

export default async function SiteFooter() {
  const lang = await getCurrentLanguage();
  const t = uiText[lang];
  const [{ staticInfo, translation }, socialLinks] = await Promise.all([
    getStaticShell(lang),
    apiGet<SocialLink[]>("/social-links"),
  ]);

  const infoLinks = [
    { label: translation?.navCatalog ?? t.catalog, href: "/catalog" },
    { label: translation?.navConstructor ?? t.constructor, href: "/constructor" },
    { label: translation?.navBranches ?? t.branches, href: "/branches" },
    { label: translation?.navContacts ?? t.contacts, href: "/contacts" },
  ];

  return (
    <footer className="mt-auto w-full bg-[#111] px-4 py-10 text-zinc-400 sm:px-5 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Image src="/header/lc.png" alt="CARDINAR" width={132} height={26} />

        <div className="mt-8 grid grid-cols-1 gap-8 border-b border-zinc-800 pb-10 text-sm sm:grid-cols-2 sm:text-xs lg:grid-cols-5">
          <div>
            <h4 className="footer-title">
              {translation?.footerInformationTitle ?? t.information}
            </h4>
            <div className="space-y-2">
              {infoLinks.map((item) => (
                <Link key={item.href} className="footer-link block" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-title">
              {translation?.footerPhoneTitle ?? t.phone}
            </h4>
            {staticInfo?.phoneNumber ? (
              <a className="footer-link" href={`tel:${staticInfo.phoneNumber}`}>
                {staticInfo.phoneNumber}
              </a>
            ) : null}
          </div>

          <div>
            <h4 className="footer-title">
              {translation?.footerEmailTitle ?? t.email}
            </h4>
            {staticInfo?.email ? (
              <a className="footer-link" href={`mailto:${staticInfo.email}`}>
                {staticInfo.email}
              </a>
            ) : null}
          </div>

          <div>
            <h4 className="footer-title">
              {translation?.footerAddressTitle ?? t.address}
            </h4>
            <p className="leading-5 text-zinc-300">
              {translation?.address ?? staticInfo?.address}
            </p>
          </div>

          <div className="flex gap-3 sm:col-span-2 lg:col-span-1 lg:justify-end">
            {(socialLinks ?? []).map((social) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700"
                aria-label={social.title}
              >
                {social.icon ? (
                  <Image
                    src={assetUrl(social.icon)}
                    alt=""
                    width={18}
                    height={18}
                    unoptimized
                    style={{ width: 18, height: 18 }}
                  />
                ) : (
                  <span>{social.title.slice(0, 1)}</span>
                )}
              </a>
            ))}
          </div>
        </div>

        <p className="pt-6 text-[11px] text-zinc-600">
          © {new Date().getFullYear()} CARDINAR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
