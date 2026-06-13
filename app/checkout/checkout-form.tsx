"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Branch, CurrentUser } from "../lib/api";
import { assetUrl } from "../lib/assets";
import {
  CartItem,
  clearCart,
  readCart,
  removeCartItem,
  updateCartQuantity,
} from "../lib/cart";

type CheckoutFormProps = {
  branches: Branch[];
  user: CurrentUser | null;
  labels: Record<string, string>;
};

export default function CheckoutForm({
  branches,
  user,
  labels,
}: CheckoutFormProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [delivery, setDelivery] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // The cart is browser-owned state persisted in localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  function changeQuantity(index: number, quantity: number) {
    updateCartQuantity(index, quantity);
    setItems(readCart());
  }

  function remove(index: number) {
    removeCartItem(index);
    setItems(readCart());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!user) {
      setMessage(labels.loginRequired);
      return;
    }
    if (items.some((item) => !item.articulId)) {
      setMessage(labels.compatibilityRequired);
      return;
    }

    const form = new FormData(event.currentTarget);
    setSubmitting(true);

    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branchId: Number(form.get("branchId")),
        fullName: String(form.get("fullName")),
        phoneNumber: String(form.get("phoneNumber")),
        email: String(form.get("email") || "") || undefined,
        delivery,
        paymentMethod: String(form.get("paymentMethod")),
        items: items.map((item) => ({
          productId: item.productId,
          articulId: item.articulId,
          quantity: item.quantity,
        })),
      }),
    });
    const data = (await response.json().catch(() => null)) as
      | { message?: string; id?: number }
      | null;

    if (response.ok) {
      clearCart();
      setItems([]);
      setMessage(`${labels.orderSuccess} #${data?.id ?? ""}`);
    } else {
      setMessage(data?.message ?? labels.orderFailed);
    }
    setSubmitting(false);
  }

  if (!items.length) {
    return (
      <div className="border border-zinc-200 py-16 text-center">
        <p className="text-zinc-500">{labels.emptyCart}</p>
        <Link
          href="/catalog"
          className="mt-5 inline-block bg-[#1f1f1f] px-6 py-3 text-sm font-semibold text-white"
        >
          {labels.catalog}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <section className="space-y-5">
        {items.map((item, index) => (
          <article
            key={`${item.productId}-${item.articulId ?? "none"}`}
            className="grid grid-cols-[72px_minmax(0,1fr)_44px] gap-3 border-b border-zinc-200 pb-5 sm:grid-cols-[96px_minmax(0,1fr)_44px] sm:gap-5"
          >
            <div className="relative h-18 w-18 bg-zinc-100 sm:h-24 sm:w-24">
              {item.image ? (
                <Image
                  src={assetUrl(item.image)}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 639px) 72px, 96px"
                  className="object-contain p-2"
                />
              ) : null}
            </div>
            <div>
              <h2 className="break-words text-base font-medium sm:text-lg">{item.title}</h2>
              <div className="mt-3 inline-flex items-center sm:mt-4 bg-zinc-100">
                <button
                  type="button"
                  className="h-11 w-11"
                  onClick={() =>
                    changeQuantity(index, Math.max(1, item.quantity - 1))
                  }
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  className="h-11 w-11"
                  onClick={() => changeQuantity(index, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#9a744f]">
                {(item.price * item.quantity).toLocaleString("ru-RU")} сум
              </p>
            </div>
            <button
              type="button"
              aria-label={labels.remove}
              className="flex h-11 w-11 items-center justify-center text-xl"
              onClick={() => remove(index)}
            >
              ×
            </button>
          </article>
        ))}
      </section>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-10">
        <section>
          <h2 className="mb-5 text-base font-semibold">① {labels.customer}</h2>
          <div className="space-y-4">
            <input
              className="select-field"
              name="fullName"
              defaultValue={user?.fullName}
              placeholder={labels.fullName}
              required
            />
            <input
              className="select-field"
              name="phoneNumber"
              defaultValue={user?.phoneNumber}
              placeholder={labels.phone}
              required
            />
            <input
              className="select-field"
              name="email"
              type="email"
              placeholder={labels.email}
            />
          </div>
        </section>

        <div className="space-y-8">
          <section>
            <h2 className="mb-5 text-base font-semibold">② {labels.branch}</h2>
            <select className="select-field" name="branchId" required>
              <option value="">{labels.chooseBranch}</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.title} — {branch.address}
                </option>
              ))}
            </select>
          </section>
          <section>
            <h2 className="mb-5 text-base font-semibold">
              ③ {labels.receiveMethod}
            </h2>
            <label className="mb-2 flex min-h-11 items-center gap-3 text-sm">
              <input
                type="radio"
                checked={!delivery}
                onChange={() => setDelivery(false)}
              />
              {labels.pickup}
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="radio"
                checked={delivery}
                onChange={() => setDelivery(true)}
              />
              {labels.delivery}
            </label>
          </section>
        </div>

        <section>
          <h2 className="mb-5 text-base font-semibold">④ {labels.payment}</h2>
          {[
            ["cash", labels.cash],
            ["payme", "Payme"],
            ["click", "Click"],
            ["uzum", "Uzum bank"],
          ].map(([value, text], index) => (
            <label key={value} className="mb-2 flex min-h-11 items-center gap-3 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                defaultChecked={index === 0}
              />
              {text}
            </label>
          ))}
        </section>
      </div>

      <div className="mt-10 flex flex-col items-stretch justify-between gap-4 border-t sm:flex-row sm:items-center border-zinc-200 pt-6">
        <p className="text-xl font-bold">
          {labels.total}: {total.toLocaleString("ru-RU")} сум
        </p>
        <button
          className="min-h-11 w-full bg-[#1f1f1f] px-8 py-3 text-sm sm:w-auto font-semibold text-white disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? labels.processing : labels.placeOrder}
        </button>
      </div>
      {message ? (
        <p className="mt-5 border border-zinc-200 bg-zinc-50 p-4 text-sm">
          {message}
        </p>
      ) : null}
    </form>
  );
}
