import { getCurrentLanguage, getStaticShell, uiText } from "../lib/api";
import RequestHelpForm from "./request-help-form";

export default async function RequestHelp() {
  const lang = await getCurrentLanguage();
  const { translation } = await getStaticShell(lang);
  const t = uiText[lang];

  return (
    <section className="mx-4 my-12 grid max-w-6xl grid-cols-1 gap-8 bg-[#1f1f1f] px-5 py-7 text-white sm:mx-5 sm:px-8 sm:py-8 md:grid-cols-[1fr_minmax(320px,420px)] lg:mx-auto lg:my-16">
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
