import { redirect } from "next/navigation";
import { getCurrentLanguage } from "../../../lib/api";

interface Props {
    searchParams: Promise<{
        token?: string;
        type?: string;
        error?: string;
    }>;
}

export default async function VerifyPage({ searchParams }: Props) {
    const params = await searchParams;
    const language = await getCurrentLanguage();
    const messages = language === "uz"
        ? {
            missing: "Tasdiqlash havolasi noto'g'ri.",
            failed: "Tasdiqlash amalga oshmadi. Havola eskirgan yoki avval ishlatilgan.",
            unavailable: "Tasdiqlash xizmati vaqtincha ishlamayapti.",
        }
        : {
            missing: "Ссылка подтверждения недействительна.",
            failed: "Не удалось подтвердить аккаунт. Ссылка истекла или уже использована.",
            unavailable: "Сервис подтверждения временно недоступен.",
        };

    if (params.error) {
        const message = params.error === "service_unavailable"
            ? messages.unavailable
            : params.error === "invalid_link"
                ? messages.missing
                : messages.failed;

        return (
            <main className="mx-auto flex min-h-72 max-w-xl items-center px-5 py-16">
                <div className="w-full border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                    {message}
                </div>
            </main>
        );
    }

    if (!params.token || (params.type !== "register" && params.type !== "login")) {
        return (
            <main className="mx-auto flex min-h-72 max-w-xl items-center px-5 py-16">
                <div className="w-full border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                    {messages.missing}
                </div>
            </main>
        );
    }

    const query = new URLSearchParams({
        token: params.token,
        type: params.type,
    });
    redirect(`/api/auth/verify?${query.toString()}`);
}
