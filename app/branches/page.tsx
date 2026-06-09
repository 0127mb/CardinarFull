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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-6 text-sm text-zinc-500 sm:mb-8">
        {t.home} / {t.branches}
      </div>
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900">
        {t.branchesTitle}
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {translatedBranches.map((branch) => (
          <a
            key={branch.id}
            href={yandexMapUrl(branch)}
            target="_blank"
            rel="noreferrer"
            className="block border border-zinc-200 p-4 sm:p-6 transition hover:border-zinc-900"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
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
