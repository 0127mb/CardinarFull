import RequestHelp from "../components/request-help";
import {
  apiGet,
  Branch,
  getCurrentLanguage,
  getProductTranslations,
  translateById,
  uiText,
} from "../lib/api";

function yandexMapUrl(branch: Branch) {
  return `https://yandex.com/maps/?pt=${branch.longitude},${branch.latitude}&z=16&l=map`;
}

export default async function BranchesPage() {
  const lang = await getCurrentLanguage();
  const t = uiText[lang];
  const [branches, translations] = await Promise.all([
    apiGet<Branch[]>("/branches?onlyActive=true"),
    getProductTranslations(lang),
  ]);
  const translatedBranches = (branches ?? []).map((branch) =>
    translateById(branch, translations.branchTitles, "branchId"),
  );

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 text-sm text-zinc-500">
        {t.home} / {t.branches}
      </div>
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900">
        {t.branchesTitle}
      </h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {translatedBranches.map((branch) => (
          <a
            key={branch.id}
            href={yandexMapUrl(branch)}
            target="_blank"
            rel="noreferrer"
            className="block border border-zinc-200 p-6 transition hover:border-zinc-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {branch.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {branch.region}
                  {branch.district ? `, ${branch.district}` : ""}
                  <br />
                  {branch.address}
                </p>
              </div>
              <span className="text-xs uppercase text-zinc-500">
                {branch.branchType}
              </span>
            </div>
            <p className="mt-5 text-sm font-semibold text-zinc-900">
              {branch.phoneNumber}
            </p>
          </a>
        ))}
      </div>
      <RequestHelp />
    </main>
  );
}
