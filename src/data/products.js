import database from "./database.json";

export const products = database.Product;

export const brands = [
  "Tất cả",
  ...new Set(products.map((product) => product.brand)),
];

export function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

export function parsePrice(price) {
  return Number(price.replace(/[^0-9]/g, ""));
}

export function formatPrice(price) {
  return `${price.toLocaleString("vi-VN")}₫`;
}
