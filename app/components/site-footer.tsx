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
    <footer className="mt-auto w-full bg-[#111] px-5 py-12 text-zinc-400">
      <div className="mx-auto max-w-7xl">
        <Image src="/header/lc.png" alt="CARDINAR" width={132} height={26} />

        <div className="mt-10 grid grid-cols-1 gap-8 border-b border-zinc-800 pb-10 text-xs md:grid-cols-5">
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

          <div className="flex gap-3 md:justify-end">
            {(socialLinks ?? []).map((social) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700"
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
