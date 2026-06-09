import RequestHelp from "../components/request-help";
import ConstructorConfigurator from "./constructor-configurator";
import {
  apiGet,
  CarMake,
  CarModel,
  Color,
  CustomModel,
  getCurrentLanguage,
  getProductTranslations,
  Part,
  Product,
  translatedProduct,
  translateById,
  uiText,
} from "../lib/api";

type ConstructorPageProps = {
  searchParams?: Promise<{ productId?: string }>;
};

export default async function ConstructorPage({
  searchParams,
}: ConstructorPageProps) {
  const lang = await getCurrentLanguage();
  const t = uiText[lang];
  const productId = (await searchParams)?.productId;
  const [models, parts, colors, carMakes, carModels, translations, product] =
    await Promise.all([
      apiGet<CustomModel[]>("/custom-models"),
      apiGet<Part[]>("/parts"),
      apiGet<Color[]>("/colors"),
      apiGet<CarMake[]>("/car-makes"),
      apiGet<CarModel[]>("/car-models"),
      getProductTranslations(lang),
      productId ? apiGet<Product>(`/products/${productId}`) : null,
    ]);
  const selectedProduct = product
    ? translatedProduct(product, translations)
    : null;

  const translatedModels = (models ?? []).map((customModel) =>
    translateById(customModel, translations.customModelTitles, "customModelId"),
  );
  const translatedParts = (parts ?? []).map((part) => ({
    ...part,
    color: part.color ?? part.__color__,
    material: part.material ?? part.__material__,
    title:
      translations.partTitles.find((translation) => translation.partId === part.id)
        ?.title ?? part.title,
  }));
  const translatedColors = (colors ?? []).map((color) =>
    translateById(color, translations.colorTitles, "colorId"),
  );
  const translatedCarMakes = (carMakes ?? []).map((make) =>
    translateById(make, translations.carMakeTitles, "carMakeId"),
  );
  const translatedCarModels = (carModels ?? []).map((carModel) =>
    translateById(carModel, translations.carModelTitles, "carModelId"),
  );
  const model = translatedModels[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-6 text-sm text-zinc-500 sm:mb-8">
        {t.home} / {t.constructor}
      </div>
      {selectedProduct ? (
        <div className="mb-6 border border-zinc-200 sm:mb-8 bg-zinc-50 px-5 py-4">
          <p className="text-xs font-bold uppercase text-zinc-400">
            {t.customizer}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-zinc-950">
            {selectedProduct.title}
          </h1>
        </div>
      ) : null}
      <ConstructorConfigurator
        model={model}
        parts={translatedParts}
        colors={translatedColors}
        carMakes={translatedCarMakes}
        carModels={translatedCarModels}
        labels={{
          make: t.make,
          model: t.model,
          color: t.color,
          emptyProducts: t.emptyProducts,
          constructorDescription: t.constructorDescription,
          submit: t.submit,
          partCentral: t.partCentral,
          partRare: t.partRare,
          partSide: t.partSide,
          partStitch: t.partStitch,
        }}
      />
      <RequestHelp />
    </main>
  );
}
