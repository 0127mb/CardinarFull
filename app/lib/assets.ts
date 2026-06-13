export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://cardinar.onrender.com"
).replace(/\/+$/, "");

export function assetUrl(image?: string | null) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}/uploads/${image.replace(/^\/?uploads\//, "")}`;
}
