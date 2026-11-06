import { describe, expect, it } from "vitest";

import { formatCheckoutUrl } from "@/lib/shopify-storefront";

describe("Shopify checkout URL", () => {
  it("always marks Shopify checkout as the online store channel", () => {
    expect(formatCheckoutUrl("https://example.myshopify.com/cart/c/example")).toBe(
      "https://example.myshopify.com/cart/c/example?channel=online_store",
    );
  });

  it("preserves checkout query parameters while setting the online store channel", () => {
    expect(formatCheckoutUrl("https://example.myshopify.com/cart/c/example?key=abc&channel=other")).toBe(
      "https://example.myshopify.com/cart/c/example?key=abc&channel=online_store",
    );
  });
});