import Image from "next/image";
import Link from "next/link";
import { assetUrl, Product } from "../lib/api";
import ProductActions from "./product-actions";

type ProductCardProps = {
  product: Product;
  labels: {
    addToCart: string;
    buy: string;
    customizer: string;
    added: string;
  };
};

export default function ProductCard({ product, labels }: ProductCardProps) {
  const image = [...(product.images ?? [])].sort(
    (a, b) => a.position - b.position,
  )[0]?.image;
  const articulId = product.articuls?.[0]?.id;

  return (
    <article className="product-card flex h-full flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-zinc-100">
          {image ? (
            <Image
              src={assetUrl(image)}
              alt={product.title}
              fill
              unoptimized
              sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
              className="object-contain p-2 sm:p-4"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
              CARDINAR
            </div>
          )}
          {product.status ? (
            <span className="badge">{product.status}</span>
          ) : null}
        </div>
        <div className="mt-3">
          <h3 className="line-clamp-2 min-h-9 text-sm font-medium leading-5 text-zinc-900">
            {product.title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            {Number(product.price).toLocaleString("ru-RU")} сум
          </p>
        </div>
      </Link>
      <ProductActions
        compact
        productId={product.id}
        articulId={articulId}
        title={product.title}
        price={Number(product.price)}
        image={image}
        labels={labels}
      />
    </article>
  );
}
