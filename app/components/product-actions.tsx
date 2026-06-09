"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCartItem } from "../lib/cart";

type ProductActionsProps = {
  productId: number;
  articulId?: number;
  title: string;
  price: number;
  image?: string;
  labels: {
    addToCart: string;
    buy: string;
    customizer: string;
    added: string;
  };
  compact?: boolean;
};

export default function ProductActions({
  productId,
  articulId,
  title,
  price,
  image,
  labels,
  compact = false,
}: ProductActionsProps) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function addToCart() {
    addCartItem({
      productId,
      articulId,
      title,
      price,
      image,
      quantity: 1,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  function buyNow() {
    addToCart();
    router.push("/checkout");
  }

  return (
    <div
      className={`flex gap-2 ${
        compact
          ? "mt-auto flex-col pt-3 sm:flex-row sm:flex-wrap"
          : "mt-6 flex-col sm:flex-row sm:flex-wrap"
      }`}
    >
      <button
        type="button"
        onClick={addToCart}
        className={
          compact
            ? "min-h-11 text-left text-xs font-semibold text-[#1773d1] sm:min-h-0"
            : "min-h-11 bg-[#1f1f1f] px-6 py-3 text-sm font-semibold text-white"
        }
      >
        {added ? labels.added : labels.addToCart}
      </button>
      {!compact ? (
        <button
          type="button"
          onClick={buyNow}
          className="min-h-11 border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900"
        >
          {labels.buy}
        </button>
      ) : null}
      <Link
        href={`/constructor?productId=${productId}`}
        className={
          compact
            ? "flex min-h-11 items-center text-xs font-semibold text-zinc-600 sm:min-h-0"
            : "flex min-h-11 items-center justify-center border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900"
        }
      >
        {labels.customizer}
      </Link>
    </div>
  );
}
