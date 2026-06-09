"use client";

import Image from "next/image";
import { useState } from "react";
import { assetUrl } from "../lib/assets";
import type {
  CarMake,
  CarModel,
  Color,
  CustomModel,
  Part,
} from "../lib/api";

type TranslatedPart = Part & {
  color?: Color;
};

type ConstructorConfiguratorProps = {
  model?: CustomModel;
  parts: TranslatedPart[];
  colors: Color[];
  carMakes: CarMake[];
  carModels: CarModel[];
  labels: {
    make: string;
    model: string;
    color: string;
    emptyProducts: string;
    constructorDescription: string;
    submit: string;
    partCentral: string;
    partRare: string;
    partSide: string;
    partStitch: string;
  };
};

export default function ConstructorConfigurator({
  model,
  parts,
  colors,
  carMakes,
  carModels,
  labels,
}: ConstructorConfiguratorProps) {
  const [selectedImage, setSelectedImage] = useState(model?.image ?? "");
  const [selectedAlt, setSelectedAlt] = useState(model?.title ?? "");
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);

  const partLabels = {
    central: labels.partCentral,
    rare: labels.partRare,
    side: labels.partSide,
    stitch: labels.partStitch,
  };

  function selectPart(part: TranslatedPart) {
    setSelectedImage(part.image);
    setSelectedAlt(part.title ?? partLabels[part.part]);
    setSelectedPartId(part.id);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)_240px] xl:grid-cols-[240px_minmax(0,1fr)_280px] xl:gap-10">
      <aside className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-3 lg:block lg:space-y-8">
        <div>
          <h2 className="filter-title">{labels.make}</h2>
          <select className="select-field">
            {carMakes.map((make) => (
              <option key={make.id}>{make.title}</option>
            ))}
          </select>
        </div>
        <div>
          <h2 className="filter-title">{labels.model}</h2>
          <select className="select-field">
            {carModels.map((carModel) => (
              <option key={carModel.id}>{carModel.title}</option>
            ))}
          </select>
        </div>
        <div>
          <h2 className="filter-title">{labels.color}</h2>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <span
                key={color.id}
                className="h-8 w-8 rounded-full border sm:h-6 sm:w-6 border-zinc-300"
                style={{ backgroundColor: color.color }}
                title={color.title}
              />
            ))}
          </div>
        </div>
      </aside>

      <section>
        <div className="relative mx-auto aspect-square max-w-lg bg-zinc-100">
          {selectedImage ? (
            <Image
              key={selectedImage}
              src={assetUrl(selectedImage)}
              alt={selectedAlt}
              fill
              unoptimized
              sizes="(max-width: 1023px) calc(100vw - 32px), 512px"
              className="object-contain p-4 sm:p-8"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm font-semibold text-zinc-400">
              {labels.emptyProducts}
            </div>
          )}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-zinc-600">
          {labels.constructorDescription}
        </p>
        <button className="mt-6 min-h-11 w-full bg-[#1f1f1f] px-8 py-3 text-sm sm:w-auto font-semibold text-white">
          {labels.submit}
        </button>
      </section>

      <aside className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:block lg:space-y-6">
        {(["central", "rare", "side", "stitch"] as const).map((partName) => (
          <div key={partName}>
            <h2 className="filter-title">{partLabels[partName]}</h2>
            <div className="flex flex-wrap gap-2">
              {parts
                .filter((part) => part.part === partName)
                .slice(0, 6)
                .map((part) => {
                  const selected = selectedPartId === part.id;

                  return (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => selectPart(part)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-zinc-50 transition ${
                        selected
                          ? "border-[#d71920] ring-2 ring-[#d71920]/20"
                          : "border-zinc-200 hover:border-zinc-500"
                      }`}
                      title={part.title ?? partName}
                      aria-pressed={selected}
                    >
                      <Image
                        src={assetUrl(part.image)}
                        alt={part.title ?? partName}
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                      <span
                        className="absolute bottom-1 right-1 h-4 w-4 rounded-full border border-white shadow"
                        style={{ backgroundColor: part.color?.color ?? "#ddd" }}
                      />
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
