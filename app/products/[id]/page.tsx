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
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 text-sm text-zinc-500">
        {t.home} / {current.title}
      </div>
      <section className="grid grid-cols-1 gap-10 md:grid-cols-[90px_1fr_420px]">
        <div className="flex gap-3 md:flex-col">
          {images.slice(0, 4).map((image) => (
            <div key={image.id} className="relative h-20 w-20 bg-zinc-100">
              <Image
                src={assetUrl(image.image)}
                alt=""
                fill
                unoptimized
                sizes="80px"
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>

        <div className="relative aspect-square bg-zinc-100">
          {images[0]?.image ? (
            <Image
              src={assetUrl(images[0].image)}
              alt={current.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-contain p-8"
            />
          ) : null}
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">{current.title}</h1>
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

      <section className="py-16">
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
