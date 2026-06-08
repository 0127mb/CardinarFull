import ProductCard from "./product-card";
import { Product } from "../lib/api";

type ProductGridProps = {
  products: Product[];
  labels: {
    addToCart: string;
    buy: string;
    customizer: string;
    added: string;
  };
  emptyLabel: string;
};

export default function ProductGrid({
  products,
  labels,
  emptyLabel,
}: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="py-16 text-center text-sm text-zinc-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          labels={labels}
        />
      ))}
    </div>
  );
}
