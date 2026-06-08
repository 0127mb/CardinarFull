import { redirect } from "next/navigation";
import { assetUrl, getCurrentLanguage, getCurrentUser } from "../lib/api";
import ProfileImageUploader from "./profile-image-uploader";

const DEFAULT_PROFILE_IMAGE = "https://github.com/identicons/cardinar-user.png";

const profileText = {
  ru: {
    title: "Профиль",
    subtitle: "Данные аккаунта",
    role: "Роль",
    admin: "Администратор",
    user: "Пользователь",
    status: "Статус аккаунта",
    active: "Активен",
    inactive: "Не активен",
    fullName: "Имя",
    phoneNumber: "Телефон",
    email: "E-mail",
    upload: "Загрузить фото профиля",
    uploading: "Загрузка...",
  },
  uz: {
    title: "Profil",
    subtitle: "Akkaunt malumotlari",
    role: "Rol",
    admin: "Administrator",
    user: "Foydalanuvchi",
    status: "Akkaunt holati",
    active: "Faol",
    inactive: "Faol emas",
    fullName: "Ism",
    phoneNumber: "Telefon",
    email: "E-mail",
    upload: "Profil rasmini yuklash",
    uploading: "Yuklanmoqda...",
  },
};

export default async function ProfilePage() {
  const [language, currentUser] = await Promise.all([
    getCurrentLanguage(),
    getCurrentUser(),
  ]);

  if (!currentUser) {
    redirect("/features/authentication");
  }

  const t = profileText[language];
  const profileImage = currentUser.profileImage
    ? assetUrl(currentUser.profileImage)
    : DEFAULT_PROFILE_IMAGE;
  const details = [
    { label: t.fullName, value: currentUser.fullName },
    { label: t.phoneNumber, value: currentUser.phoneNumber },
    { label: t.email, value: currentUser.email },
    { label: t.role, value: currentUser.isAdmin ? t.admin : t.user },
    { label: t.status, value: currentUser.isActive ? t.active : t.inactive },
  ];

  return (
    <main className="flex-1 bg-white">
      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-[280px_1fr] md:py-16">
        <aside className="flex flex-col items-center border border-zinc-200 p-8">
          <ProfileImageUploader
            fullName={currentUser.fullName}
            initialImage={profileImage}
            defaultImage={DEFAULT_PROFILE_IMAGE}
            uploadText={t.upload}
            uploadingText={t.uploading}
          />
          <h1 className="mt-4 max-w-full truncate text-center text-2xl font-bold text-zinc-950">
            {currentUser.fullName}
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            {currentUser.isAdmin ? t.admin : t.user}
          </p>
        </aside>

        <section className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-[#d71920]">
            {t.subtitle}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-950">{t.title}</h2>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="border border-zinc-200 p-5">
                <dt className="text-xs font-bold uppercase text-zinc-400">
                  {item.label}
                </dt>
                <dd className="mt-2 break-words text-base font-semibold text-zinc-950">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </main>
  );
}
