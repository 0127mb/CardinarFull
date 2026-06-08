import { getCurrentLanguage, getStaticShell, uiText } from "../lib/api";
import RequestHelpForm from "./request-help-form";

export default async function RequestHelp() {
  const lang = await getCurrentLanguage();
  const { translation } = await getStaticShell(lang);
  const t = uiText[lang];

  return (
    <section className="mx-auto my-16 grid max-w-6xl grid-cols-1 gap-8 bg-[#1f1f1f] px-8 py-8 text-white md:grid-cols-[1fr_420px]">
      <div>
        <p className="text-xl font-bold uppercase">
          {translation?.requestTitle ?? t.requestTitle}
        </p>
        <p className="mt-2 max-w-md text-sm text-zinc-300">
          {translation?.requestDescription ?? t.requestDescription}
        </p>
        <div className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-white text-lg">
          +
        </div>
      </div>

      <RequestHelpForm
        labels={{
          name: t.requestName,
          phone: t.requestPhone,
          email: t.requestEmail,
          comments: t.requestComments,
          submit: t.requestSubmit,
          sending: t.requestSending,
          success: t.requestSuccess,
          error: t.requestError,
        }}
      />
    </section>
  );
}
