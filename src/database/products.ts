import { SEED_PRODUCTS } from "@/database/sqlite";
import { Product } from "@/types/store";

export const products: Product[] = SEED_PRODUCTS;

export const brands: string[] = [
  "Tất cả",
  ...Array.from(new Set(products.map((product) => product.brand))),
];

export function getProduct(productId: string | undefined | null): Product | undefined {
  if (!productId) return undefined;
  return products.find((product) => product.id === productId);
}

export function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  return Number(String(price).replace(/[^0-9]/g, ""));
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("vi-VN")}₫`;
}
