"use client";

import { useState } from "react";
import { Category, Color } from "../lib/api";

type CatalogFiltersProps = {
  categories: Category[];
  colors: Color[];
  labels: {
    filter: string;
    category: string;
    colors: string;
    all: string;
  };
};

export default function CatalogFilters({
  categories,
  colors,
  labels,
}: CatalogFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="text-sm">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="catalog-filter-panel"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center justify-between border border-zinc-200 bg-white px-4 font-bold text-zinc-900"
      >
        <span>{labels.filter}</span>
        <span aria-hidden>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div
          id="catalog-filter-panel"
          className="mt-3 space-y-8 border border-zinc-200 bg-white p-4"
        >
          <div>
            <h2 className="filter-title">{labels.category}</h2>
            <div className="space-y-2">
              <a className="filter-link" href="/catalog">
                {labels.all}
              </a>
              {categories.map((category) => (
                <a
                  key={category.id}
                  className="filter-link"
                  href={`/catalog?categoryId=${category.id}`}
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="filter-title">{labels.colors}</h2>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <span
                  key={color.id}
                  title={color.title}
                  className="h-5 w-5 rounded-full border border-zinc-300"
                  style={{ backgroundColor: color.color }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
