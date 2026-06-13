import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { API_BASE_URL, assetUrl } from "./assets";
import { LANGUAGE_COOKIE, Language } from "./language";

export { API_BASE_URL, assetUrl };

const API_URL = `${API_BASE_URL}/api`;

export type StaticInfo = {
  id: number;
  address: string;
  phoneNumber: string;
  workingHours?: string;
  email: string;
};

export type CurrentUser = {
  id: number;
  fullName: string;
  phoneNumber: string;
  profileImage?: string | null;
  isAdmin: boolean;
  isActive: boolean;
};

export type StaticTranslation = {
  id: number;
  lang: Language;
  headerTitle?: string;
  subNavbarTitle?: string;
  navCatalog?: string;
  navConstructor?: string;
  navBranches?: string;
  navContacts?: string;
  footerInformationTitle?: string;
  footerPhoneTitle?: string;
  footerEmailTitle?: string;
  footerAddressTitle?: string;
  requestTitle?: string;
  requestDescription?: string;
  address?: string;
};

export type Banner = {
  id: number;
  title: string;
  image: string;
  isActive: boolean;
};

export type ProductImage = {
  id: number;
  image: string;
  position: number;
};

export type Color = {
  id: number;
  title: string;
  color: string;
};

export type ProductColor = {
  id: number;
  color?: Color;
  __color__?: Color;
};

export type Articul = {
  id: number;
  carModelId: number;
  carModel?: {
    id: number;
    title: string;
    carMake?: {
      id: number;
      title: string;
    };
  };
  __carModel__?: {
    id: number;
    title: string;
    __carMake__?: {
      id: number;
      title: string;
    };
  };
};

export type Product = {
  id: number;
  categoryId: number;
  title: string;
  price: string | number;
  description?: string;
  status?: "new" | "sale" | "hit";
  isPremium: boolean;
  images?: ProductImage[];
  __images__?: ProductImage[];
  productColors?: ProductColor[];
  __productColors__?: ProductColor[];
  articuls?: Articul[];
  __articuls__?: Articul[];
  category?: {
    id: number;
    title: string;
  };
};

export type Branch = {
  id: number;
  title: string;
  address: string;
  district?: string;
  region: string;
  phoneNumber: string;
  longitude: string | number;
  latitude: string | number;
  isActive: boolean;
  branchType: "official" | "partner";
};

export type SocialLink = {
  id: number;
  title: string;
  link: string;
  icon: string;
};

export type Category = {
  id: number;
  title: string;
};

export type CarMake = {
  id: number;
  title: string;
};

export type CarModel = {
  id: number;
  title: string;
  carMakeId?: number;
};

export type CustomModel = {
  id: number;
  category: "cover" | "carpet";
  title: string;
  image: string;
};

export type Part = {
  id: number;
  category: "cover" | "carpet";
  part: "central" | "rare" | "side" | "stitch";
  title?: string;
  image: string;
  color?: Color;
  __color__?: Color;
  material?: {
    id: number;
    title: string;
  };
  __material__?: {
    id: number;
    title: string;
  };
};

type ProductTranslation = {
  id: number;
  lang: Language;
  type: string;
  title?: string;
  description?: string;
  productId?: number;
  categoryId?: number;
  materialId?: number;
  branchId?: number;
  carMakeId?: number;
  carModelId?: number;
  colorId?: number;
  partId?: number;
  bannerId?: number;
  socialLinkId?: number;
  customModelId?: number;
};

export async function getCurrentLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANGUAGE_COOKIE)?.value;
  return value === "uz" ? "uz" : "ru";
}

export async function apiGet<T>(path: string): Promise<T | null> {
  noStore();

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      credentials: "include",
      headers: accessToken
        ? {
            Cookie: `access_token=${accessToken}`,
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  return apiGet<CurrentUser>("/auth/me");
}

export async function apiPost<T, B extends Record<string, unknown>>(
  path: string,
  body: B,
): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getStaticShell(lang: Language = "uz") {
  const [staticInfo, translations] = await Promise.all([
    apiGet<StaticInfo>("/static-info/get"),
    apiGet<StaticTranslation[]>(`/static-info/translation?lang=${lang}`),
  ]);

  return {
    staticInfo,
    translation: translations?.at(-1) ?? null,
  };
}

export async function getProductTranslations(lang: Language = "uz") {
  const [
    productTitles,
    productDescriptions,
    bannerTitles,
    bannerDescriptions,
    categoryTitles,
    branchTitles,
    carMakeTitles,
    carModelTitles,
    colorTitles,
    partTitles,
    customModelTitles,
  ] = await Promise.all([
    apiGet<ProductTranslation[]>(
      `/products/title/productsTranslation?lang=${lang}`,
    ),
    apiGet<ProductTranslation[]>(
      `/products/description/productsTranslation?lang=${lang}`,
    ),
    apiGet<ProductTranslation[]>(
      `/banners/title/productsTranslation?lang=${lang}`,
    ),
    apiGet<ProductTranslation[]>(
      `/banners/description/productsTranslation?lang=${lang}`,
    ),
    apiGet<ProductTranslation[]>(
      `/categories/title/productsTranslation?lang=${lang}`,
    ),
    apiGet<ProductTranslation[]>(`/branches/title/productsTranslation?lang=${lang}`),
    apiGet<ProductTranslation[]>(`/car_makes/title/productsTranslation?lang=${lang}`),
    apiGet<ProductTranslation[]>(`/car_models/title/productsTranslation?lang=${lang}`),
    apiGet<ProductTranslation[]>(`/colors/title/productsTranslation?lang=${lang}`),
    apiGet<ProductTranslation[]>(`/parts/title/productsTranslation?lang=${lang}`),
    apiGet<ProductTranslation[]>(
      `/custom_models/title/productsTranslation?lang=${lang}`,
    ),
  ]);

  return {
    productTitles: productTitles ?? [],
    productDescriptions: productDescriptions ?? [],
    bannerTitles: bannerTitles ?? [],
    bannerDescriptions: bannerDescriptions ?? [],
    categoryTitles: categoryTitles ?? [],
    branchTitles: branchTitles ?? [],
    carMakeTitles: carMakeTitles ?? [],
    carModelTitles: carModelTitles ?? [],
    colorTitles: colorTitles ?? [],
    partTitles: partTitles ?? [],
    customModelTitles: customModelTitles ?? [],
  };
}

export function translateById<T extends { id: number; title: string }>(
  item: T,
  translations: ProductTranslation[],
  idField:
    | "categoryId"
    | "branchId"
    | "carMakeId"
    | "carModelId"
    | "colorId"
    | "partId"
    | "customModelId",
) {
  const title = translations.find((translation) => translation[idField] === item.id)
    ?.title;
  return { ...item, title: title ?? item.title };
}

export const uiText = {
  ru: {
    search: "Поиск",
    searchButton: "Search",
    cart: "Cart",
    login: "Login",
    register: "Register",
    profile: "Профиль",
    more: "Подробнее",
    popularProducts: "Популярные товары",
    heroDefault: "Авточехлы с точной посадкой для вашего автомобиля",
    allProducts: "Все товары",
    emptyProducts: "Товары пока не добавлены.",
    filter: "Фильтр",
    home: "Главная",
    catalog: "Каталог",
    category: "Категория",
    all: "Все",
    colors: "Цвета",
    leather: "Обивочная кожа",
    constructor: "Конструктор",
    make: "Марка",
    model: "Модель",
    color: "Цвет",
    constructorDescription:
      "Выберите модель, материалы и цвета. Итоговая заявка отправляется менеджеру для уточнения комплектации.",
    submit: "Оформить",
    branches: "Где купить?",
    contacts: "Контакты",
    phone: "Телефон",
    email: "Почта",
    address: "Адрес",
    orders: "Заказы",
    orderHint: "История заказов появится после авторизации.",
    requestName: "Имя",
    requestPhone: "Телефон",
    requestEmail: "Email",
    requestComments: "Комментарий",
    requestSubmit: "Отправить",
    requestSending: "Отправка...",
    requestSuccess: "Заявка успешно отправлена.",
    requestError: "Не удалось отправить заявку.",
    requestTitle: "Нужна помощь с выбором?",
    requestDescription: "Оставьте контакты, и наш специалист свяжется с вами.",
    information: "Информация",
    notFoundProduct: "Товар не найден.",
    addToCart: "В корзину",
    buy: "Купить",
    customizer: "Кастомайзер",
    addedToCart: "Добавлено",
    descriptionMissing: "Описание товара скоро появится.",
    relatedProducts: "Похожие товары",
    orderNumber: "Номер",
    receiver: "Получатель",
    payment: "Оплата",
    status: "Статус",
    branchesTitle: "Филиалы",
    partCentral: "Центр",
    partRare: "Задняя часть",
    partSide: "Боковая часть",
    partStitch: "Строчка",
  },
  uz: {
    search: "Qidirish",
    searchButton: "Qidirish",
    cart: "Savat",
    login: "Kirish",
    register: "Royxatdan otish",
    profile: "Profil",
    more: "Batafsil",
    popularProducts: "Mashhur mahsulotlar",
    heroDefault: "Avtomobilingiz uchun aniq mos keladigan avto g'iloflar",
    allProducts: "Barcha mahsulotlar",
    emptyProducts: "Mahsulotlar hali qo'shilmagan.",
    filter: "Filtr",
    home: "Bosh sahifa",
    catalog: "Katalog",
    category: "Kategoriya",
    all: "Barchasi",
    colors: "Ranglar",
    leather: "Qoplama materiali",
    constructor: "Konstruktor",
    make: "Marka",
    model: "Model",
    color: "Rang",
    constructorDescription:
      "Model, material va ranglarni tanlang. Yakuniy buyurtma menejerga aniqlashtirish uchun yuboriladi.",
    submit: "Rasmiylashtirish",
    branches: "Qayerdan xarid qilish?",
    contacts: "Kontaktlar",
    phone: "Telefon",
    email: "Pochta",
    address: "Manzil",
    orders: "Buyurtmalar",
    orderHint: "Buyurtmalar tarixi avtorizatsiyadan keyin ko'rinadi.",
    requestName: "Ism",
    requestPhone: "Telefon",
    requestEmail: "Email",
    requestComments: "Izoh",
    requestSubmit: "Yuborish",
    requestSending: "Yuborilmoqda...",
    requestSuccess: "So'rov muvaffaqiyatli yuborildi.",
    requestError: "So'rovni yuborib bo'lmadi.",
    requestTitle: "Tanlashda yordam kerakmi?",
    requestDescription:
      "Kontaktlaringizni qoldiring, mutaxassisimiz siz bilan bog'lanadi.",
    information: "Ma'lumot",
    notFoundProduct: "Mahsulot topilmadi.",
    addToCart: "Savatga",
    buy: "Sotib olish",
    customizer: "Kastomayzer",
    addedToCart: "Qo'shildi",
    descriptionMissing: "Mahsulot tavsifi tez orada qo'shiladi.",
    relatedProducts: "O'xshash mahsulotlar",
    orderNumber: "Raqam",
    receiver: "Qabul qiluvchi",
    payment: "To'lov",
    status: "Holat",
    branchesTitle: "Filiallar",
    partCentral: "Markaz",
    partRare: "Orqa qism",
    partSide: "Yon qism",
    partStitch: "Chok",
  },
} satisfies Record<Language, Record<string, string>>;

export function translatedBanner(
  banner: Banner,
  translations: Awaited<ReturnType<typeof getProductTranslations>>,
) {
  const title = translations.bannerTitles.find(
    (translation) => translation.bannerId === banner.id,
  )?.title;
  const description = translations.bannerDescriptions.find(
    (translation) => translation.bannerId === banner.id,
  )?.description;

  return {
    ...banner,
    title: title ?? banner.title,
    description,
  };
}

export function translatedProduct(
  product: Product,
  translations: Awaited<ReturnType<typeof getProductTranslations>>,
) {
  const title = translations.productTitles.find(
    (translation) => translation.productId === product.id,
  )?.title;
  const description = translations.productDescriptions.find(
    (translation) => translation.productId === product.id,
  )?.description;

  return {
    ...product,
    title: title ?? product.title,
    description: description ?? product.description,
    images: product.images ?? product.__images__ ?? [],
    productColors: (product.productColors ?? product.__productColors__ ?? []).map(
      (productColor) => ({
        ...productColor,
        color: productColor.color ?? productColor.__color__,
      }),
    ),
    articuls: (product.articuls ?? product.__articuls__ ?? []).map((articul) => {
      const carModel = articul.carModel ?? articul.__carModel__;
      return {
        ...articul,
        carModel: carModel
          ? {
              ...carModel,
              carMake:
                "carMake" in carModel
                  ? carModel.carMake
                  : "__carMake__" in carModel
                    ? carModel.__carMake__
                    : undefined,
            }
          : undefined,
      };
    }),
  };
}
