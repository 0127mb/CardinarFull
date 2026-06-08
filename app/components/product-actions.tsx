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
    <div className={`flex flex-wrap gap-2 ${compact ? "mt-3" : "mt-6"}`}>
      <button
        type="button"
        onClick={addToCart}
        className={
          compact
            ? "text-xs font-semibold text-[#1773d1]"
            : "bg-[#1f1f1f] px-6 py-3 text-sm font-semibold text-white"
        }
      >
        {added ? labels.added : labels.addToCart}
      </button>
      {!compact ? (
        <button
          type="button"
          onClick={buyNow}
          className="border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900"
        >
          {labels.buy}
        </button>
      ) : null}
      <Link
        href={`/constructor?productId=${productId}`}
        className={
          compact
            ? "text-xs font-semibold text-zinc-600"
            : "border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900"
        }
      >
        {labels.customizer}
      </Link>
    </div>
  );
}
