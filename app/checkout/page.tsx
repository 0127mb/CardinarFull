import CheckoutForm from "./checkout-form";
import {
  apiGet,
  Branch,
  getCurrentLanguage,
  getCurrentUser,
  uiText,
} from "../lib/api";

const checkoutText = {
  ru: {
    title: "Оформить заказ",
    customer: "Данные покупателя",
    branch: "Выберите магазин",
    chooseBranch: "Адрес магазина",
    receiveMethod: "Выберите способ приёма",
    pickup: "Самовывоз",
    delivery: "Доставка",
    payment: "Способ оплаты",
    cash: "Наличными или картой при получении",
    fullName: "Ваше имя",
    phone: "Ваш номер телефона",
    email: "Ваш Email",
    remove: "Удалить",
    total: "Итого",
    placeOrder: "Оформить заказ",
    processing: "Оформление...",
    emptyCart: "Корзина пуста.",
    catalog: "Перейти в каталог",
    loginRequired: "Войдите в аккаунт перед оформлением заказа.",
    compatibilityRequired:
      "Для товара не выбрана совместимая модель. Откройте кастомайзер.",
    orderSuccess: "Заказ успешно создан",
    orderFailed: "Не удалось создать заказ.",
  },
  uz: {
    title: "Buyurtmani rasmiylashtirish",
    customer: "Xaridor ma'lumotlari",
    branch: "Do'konni tanlang",
    chooseBranch: "Do'kon manzili",
    receiveMethod: "Qabul qilish usulini tanlang",
    pickup: "Olib ketish",
    delivery: "Yetkazib berish",
    payment: "To'lov usuli",
    cash: "Qabul qilganda naqd yoki karta",
    fullName: "Ismingiz",
    phone: "Telefon raqamingiz",
    email: "Email manzilingiz",
    remove: "O'chirish",
    total: "Jami",
    placeOrder: "Buyurtma berish",
    processing: "Yuborilmoqda...",
    emptyCart: "Savat bo'sh.",
    catalog: "Katalogga o'tish",
    loginRequired: "Buyurtma berishdan oldin akkauntga kiring.",
    compatibilityRequired:
      "Mahsulot uchun mos model tanlanmagan. Kastomayzerni oching.",
    orderSuccess: "Buyurtma muvaffaqiyatli yaratildi",
    orderFailed: "Buyurtma yaratilmadi.",
  },
};

export default async function CheckoutPage() {
  const lang = await getCurrentLanguage();
  const t = uiText[lang];
  const labels = checkoutText[lang];
  const [branches, user] = await Promise.all([
    apiGet<Branch[]>("/branches?onlyActive=true"),
    getCurrentUser(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 text-sm text-zinc-500">
        {t.home} / {labels.title}
      </div>
      <h1 className="mb-12 text-3xl font-semibold">{labels.title}</h1>
      <CheckoutForm
        branches={branches ?? []}
        user={user}
        labels={labels}
      />
    </main>
  );
}
