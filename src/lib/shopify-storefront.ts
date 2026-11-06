export const SHOPIFY_API_VERSION = "2026-10";
export const SHOPIFY_DOMAIN = "build-it-for-me-efhcf-g0xb9fsc.myshopify.com";
const STOREFRONT_TOKEN = "a8f5a040503f5350a006db6d998b1081";
const API_URL = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export type Money = { amount: string; currencyCode: string };
export type ShopifyVariant = {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
};
export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  priceRange: { minVariantPrice: Money };
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: ShopifyVariant }[] };
  options: { name: string; values: string[] }[];
};
export type CartLine = {
  id: string;
  quantity: number;
  merchandise: ShopifyVariant & { product: ShopifyProduct };
};

export async function storefrontRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Store request failed (${response.status}).`);
  const payload = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join(" "));
  if (!payload.data) throw new Error("The store did not return data.");
  return payload.data;
}

const PRODUCT_FIELDS = `
  id title description handle productType
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 20) { edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } } }
  options { name values }
`;

export async function getProducts() {
  const data = await storefrontRequest<{ products: { edges: { node: ShopifyProduct }[] } }>(
    `query GetProducts { products(first: 100) { edges { node { ${PRODUCT_FIELDS} } } } }`,
  );
  return data.products.edges.map((edge) => edge.node);
}

export async function getProduct(handle: string) {
  const data = await storefrontRequest<{ productByHandle: ShopifyProduct | null }>(
    `query GetProduct($handle: String!) { productByHandle(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle },
  );
  return data.productByHandle;
}

export function formatCheckoutUrl(checkoutUrl: string) {
  const url = new URL(checkoutUrl);
  url.searchParams.set("channel", "online_store");
  return url.toString();
}

export const CART_QUERY = `query Cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;
export const CART_CREATE = `mutation CartCreate($lines: [CartLineInput!]!) {
  cartCreate(input: { lines: $lines }) {
    cart { id checkoutUrl lines(first: 100) { edges { node { id quantity merchandise { ... on ProductVariant { id } } } } } }
    userErrors { message }
  }
}`;
export const CART_ADD = `mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { id checkoutUrl lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } }
    userErrors { message }
  }
}`;
export const CART_UPDATE = `mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { message } }
}`;
export const CART_REMOVE = `mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { message } }
}`;

export function cartErrors(errors?: { message: string }[]) {
  if (errors?.length) throw new Error(errors.map((error) => error.message).join(" "));
}