import RequestHelp from "../components/request-help";
import { getCurrentLanguage, getStaticShell, uiText } from "../lib/api";

export default async function ContactsPage() {
  const lang = await getCurrentLanguage();
  const { staticInfo, translation } = await getStaticShell(lang);
  const t = uiText[lang];

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 text-sm text-zinc-500">
        {t.home} / {t.contacts}
      </div>
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900">{t.contacts}</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="contact-box">
          <span>{t.phone}</span>
          <a href={`tel:${staticInfo?.phoneNumber ?? ""}`}>
            {staticInfo?.phoneNumber ?? "-"}
          </a>
        </div>
        <div className="contact-box">
          <span>{t.email}</span>
          <a href={`mailto:${staticInfo?.email ?? ""}`}>{staticInfo?.email ?? "-"}</a>
        </div>
        <div className="contact-box">
          <span>{t.address}</span>
          <p>{translation?.address ?? staticInfo?.address ?? "-"}</p>
        </div>
      </div>
      <RequestHelp />
    </main>
  );
}
