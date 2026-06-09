import RequestHelp from "../components/request-help";
import { getCurrentLanguage, uiText } from "../lib/api";

export default async function OrdersPage() {
  const lang = await getCurrentLanguage();
  const t = uiText[lang];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-6 text-sm text-zinc-500 sm:mb-8">
        {t.home} / {t.orders}
      </div>
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900">{t.orders}</h1>
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500">
            <tr>
              <th className="py-3 font-medium">{t.orderNumber}</th>
              <th className="py-3 font-medium">{t.receiver}</th>
              <th className="py-3 font-medium">{t.phone}</th>
              <th className="py-3 font-medium">{t.payment}</th>
              <th className="py-3 font-medium">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-100">
              <td className="py-4 text-zinc-400" colSpan={5}>
                {t.orderHint}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <RequestHelp />
    </main>
  );
}
