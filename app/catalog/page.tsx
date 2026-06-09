import ProductGrid from "../components/product-grid";
import RequestHelp from "../components/request-help";
import CatalogFilters from "./catalog-filters";
import {
  apiGet,
  Category,
  Color,
  getCurrentLanguage,
  getProductTranslations,
  Product,
  translateById,
  translatedProduct,
  uiText,
} from "../lib/api";

type CatalogProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Catalog({ searchParams }: CatalogProps) {
  const lang = await getCurrentLanguage();
  const t = uiText[lang];
  const params = (await searchParams) ?? {};
  const query =
    typeof params.q === "string"
      ? params.q.trim().toLocaleLowerCase(lang)
      : "";
  const categoryId = typeof params.categoryId === "string" ? params.categoryId : "";

  const [products, categories, colors, translations] = await Promise.all([
    apiGet<Product[]>(
      `/products${categoryId ? `?categoryId=${categoryId}` : ""}`,
    ),
    apiGet<Category[]>("/categories"),
    apiGet<Color[]>("/colors"),
    getProductTranslations(lang),
  ]);

  const translatedCategories = (categories ?? []).map((category) =>
    translateById(category, translations.categoryTitles, "categoryId"),
  );
  const translatedColors = (colors ?? []).map((color) =>
    translateById(color, translations.colorTitles, "colorId"),
  );
  const translatedProducts = (products ?? [])
    .map((product) => translatedProduct(product, translations))
    .filter((product) => {
      if (!query) return true;

      const searchableValues = [
        product.title,
        ...(product.productColors ?? []).flatMap((productColor) => {
          const color = productColor.color;
          if (!color) return [];
          const translatedColor = translations.colorTitles.find(
            (translation) => translation.colorId === color.id,
          )?.title;
          return [color.title, translatedColor].filter(
            (value): value is string => Boolean(value),
          );
        }),
      ];

      return searchableValues.some((value) =>
        value.trim().toLocaleLowerCase(lang).includes(query),
      );
    });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-6 text-sm text-zinc-500 sm:mb-8">
        {t.home} / {t.catalog}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <CatalogFilters
          categories={translatedCategories}
          colors={translatedColors}
          labels={{
            filter: t.filter,
            category: t.category,
            colors: t.colors,
            all: t.all,
          }}
        />

        <section>
          <h1 className="mb-8 text-2xl font-semibold text-zinc-900">
            {t.leather}
          </h1>
          <ProductGrid
            products={translatedProducts}
            labels={{
              addToCart: t.addToCart,
              buy: t.buy,
              customizer: t.customizer,
              added: t.addedToCart,
            }}
            emptyLabel={t.emptyProducts}
          />
        </section>
      </div>
      <RequestHelp />
    </main>
  );
}
