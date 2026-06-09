import Image from "next/image";
import ProductGrid from "../../components/product-grid";
import ProductActions from "../../components/product-actions";
import RequestHelp from "../../components/request-help";
import {
  apiGet,
  assetUrl,
  getCurrentLanguage,
  getProductTranslations,
  Product,
  translatedProduct,
  uiText,
} from "../../lib/api";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const lang = await getCurrentLanguage();
  const t = uiText[lang];
  const [product, products, translations] = await Promise.all([
    apiGet<Product>(`/products/${id}`),
    apiGet<Product[]>("/products"),
    getProductTranslations(lang),
  ]);

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16 text-sm text-zinc-500">
        {t.notFoundProduct}
      </main>
    );
  }

  const current = translatedProduct(product, translations);
  const images = current.images?.sort((a, b) => a.position - b.position) ?? [];
  const related = (products ?? [])
    .filter((item) => item.id !== current.id)
    .slice(0, 4)
    .map((item) => translatedProduct(item, translations));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-6 truncate text-sm text-zinc-500 sm:mb-8">
        {t.home} / {current.title}
      </div>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[80px_minmax(0,1fr)_minmax(300px,380px)] lg:gap-8 xl:grid-cols-[90px_minmax(0,1fr)_420px] xl:gap-10">
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-none lg:flex-col lg:overflow-visible">
          {images.slice(0, 4).map((image) => (
            <div key={image.id} className="relative h-16 w-16 shrink-0 bg-zinc-100 sm:h-20 sm:w-20">
              <Image
                src={assetUrl(image.image)}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 639px) 64px, 80px"
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>

        <div className="order-1 relative aspect-square min-w-0 bg-zinc-100 lg:order-none">
          {images[0]?.image ? (
            <Image
              src={assetUrl(images[0].image)}
              alt={current.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 1023px) calc(100vw - 32px), 50vw"
              className="object-contain p-4 sm:p-8"
            />
          ) : null}
        </div>

        <div className="order-3 min-w-0 lg:order-none">
          <h1 className="break-words text-xl font-semibold text-zinc-900 sm:text-2xl">{current.title}</h1>
          <p className="mt-5 text-2xl font-semibold text-zinc-900">
            {Number(current.price).toLocaleString("ru-RU")} сум
          </p>
          <ProductActions
            productId={current.id}
            articulId={current.articuls?.[0]?.id}
            title={current.title}
            price={Number(current.price)}
            image={images[0]?.image}
            labels={{
              addToCart: t.addToCart,
              buy: t.buy,
              customizer: t.customizer,
              added: t.addedToCart,
            }}
          />
          <div className="mt-8 space-y-3 text-sm text-zinc-600">
            <p>{current.description ?? t.descriptionMissing}</p>
            {current.articuls?.[0]?.carModel ? (
              <p>
                {t.model}: {current.articuls[0].carModel.carMake?.title}{" "}
                {current.articuls[0].carModel.title}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <h2 className="section-title mb-8">{t.relatedProducts}</h2>
        <ProductGrid
          products={related}
          labels={{
            addToCart: t.addToCart,
            buy: t.buy,
            customizer: t.customizer,
            added: t.addedToCart,
          }}
          emptyLabel={t.emptyProducts}
        />
      </section>

      <RequestHelp />
    </main>
  );
}
