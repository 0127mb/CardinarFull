import Image from "next/image";
import Link from "next/link";
import ProductGrid from "./components/product-grid";
import RequestHelp from "./components/request-help";
import {
  apiGet,
  assetUrl,
  Banner,
  getCurrentLanguage,
  getProductTranslations,
  Product,
  translatedBanner,
  translatedProduct,
  uiText,
} from "./lib/api";

export default async function Home() {
  const lang = await getCurrentLanguage();
  const t = uiText[lang];
  const [banners, products, translations] = await Promise.all([
    apiGet<Banner[]>("/banners"),
    apiGet<Product[]>("/products"),
    getProductTranslations(lang),
  ]);

  const activeBanners = (banners ?? [])
    .filter((banner) => banner.isActive)
    .map((banner) => translatedBanner(banner, translations));
  const heroBanner = activeBanners[0];
  const translatedProducts = (products ?? [])
    .map((product) => translatedProduct(product, translations))
    .slice(0, 8);

  return (
    <main>
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-5 py-14 md:grid-cols-[1fr_460px]">
        <div>
          <h1 className="text-6xl font-black tracking-normal text-[#d71920] md:text-7xl">
            CARDINAR
          </h1>
          <p className="mt-5 max-w-md text-sm font-semibold uppercase text-zinc-900">
            {heroBanner?.title ?? t.heroDefault}
          </p>
          {heroBanner?.description ? (
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
              {heroBanner.description}
            </p>
          ) : null}
          <Link className="mt-8 inline-block rounded-full bg-[#1f1f1f] px-6 py-3 text-sm font-semibold text-white" href="/catalog">
            {t.more}
          </Link>
        </div>
        <div className="relative aspect-[5/4]">
          {heroBanner?.image ? (
            <Image
              src={assetUrl(heroBanner.image)}
              alt={heroBanner.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 460px"
              className="object-contain"
            />
          ) : (
            <div className="h-full bg-zinc-100" />
          )}
        </div>
      </section>

      {activeBanners.length > 1 ? (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 md:grid-cols-3">
          {activeBanners.slice(1, 4).map((banner, index) => (
            <Link
              key={banner.id}
              href="/catalog"
              className={index === 0 ? "banner-tile md:col-span-2" : "banner-tile"}
            >
              {banner.image ? (
                <Image
                  src={assetUrl(banner.image)}
                  alt={banner.title}
                  fill
                  unoptimized
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                   className="object-cover"
                />
              ) : null}
              <span>{banner.title}</span>
            </Link>
          ))}
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="section-title">{t.popularProducts}</h2>
          <Link className="text-sm font-semibold text-[#1773d1]" href="/catalog">
            {t.allProducts}
          </Link>
        </div>
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

      <RequestHelp />
    </main>
  );
}
