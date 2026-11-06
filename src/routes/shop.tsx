import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ShopGrid, StoreLayout } from "@/components/storefront";
import { getProducts, type ShopifyProduct } from "@/lib/shopify-storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/shop")({
  head: () => pageMetadata("Shop Fragrances | AM11 Scents", "Browse the AM11 Scents fragrance collection and find a scent to make your own."),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getProducts().then((data) => { if (active) setProducts(data); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <StoreLayout><section className="shop-container py-12 sm:py-16"><p className="eyebrow">AM11 Scents</p><h1 className="mt-3 display-title text-5xl sm:text-6xl">The collection</h1><p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">A considered edit of fragrances. Find the one that feels like you.</p>{loading ? <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] animate-pulse bg-secondary" />)}</div> : error ? <p role="alert" className="mt-10 border-y border-border py-12 text-center text-sm text-muted-foreground">The collection is temporarily unavailable. Please try again shortly.</p> : <div className="mt-9"><ShopGrid products={products} /></div>}</section></StoreLayout>;
}