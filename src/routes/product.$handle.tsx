import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { StoreLayout, money } from "@/components/storefront";
import { useCartStore } from "@/lib/cart-store";
import { getProduct, type ShopifyProduct } from "@/lib/shopify-storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => pageMetadata(
    `${params.handle.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} | AM11 Scents`,
    "Discover this fragrance from the AM11 Scents collection.",
  ),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, isLoading, error } = useCartStore();
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    let active = true;
    getProduct(handle).then((data) => { if (active) setProduct(data); }).catch(() => { if (active) setLoadError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [handle]);
  if (loading) return <StoreLayout><section className="shop-container grid gap-9 py-12 md:grid-cols-2"><div className="aspect-[4/5] animate-pulse bg-secondary" /><div className="space-y-5 pt-12"><div className="h-4 w-32 animate-pulse bg-secondary" /><div className="h-12 w-2/3 animate-pulse bg-secondary" /><div className="h-5 w-24 animate-pulse bg-secondary" /></div></section></StoreLayout>;
  if (loadError) return <StoreLayout><div className="shop-container py-24 text-center"><h1 className="font-display text-4xl">The fragrance could not be loaded</h1><Button className="mt-6" asChild><Link to="/shop"><ArrowLeft /> Back to the collection</Link></Button></div></StoreLayout>;
  if (!product) return <StoreLayout><div className="shop-container py-24 text-center"><p className="eyebrow">AM11 Scents</p><h1 className="mt-4 font-display text-4xl">This fragrance is unavailable</h1><Button className="mt-6" asChild><Link to="/shop"><ArrowLeft /> Back to the collection</Link></Button></div></StoreLayout>;

  const variant = product.variants.edges.find((entry) => entry.node.availableForSale)?.node;
  const image = product.images.edges[0]?.node;
  const handleAdd = async () => {
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity, selectedOptions: variant.selectedOptions });
    if (!useCartStore.getState().error) setAdded(true);
  };

  return <StoreLayout><section className="shop-container py-8 sm:py-12"><Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> The collection</Link><div className="grid gap-9 md:grid-cols-2 md:gap-14"><div className="product-image aspect-[4/5]">{image ? <img src={image.url} alt={image.altText ?? product.title} /> : <div className="grid size-full place-items-center text-sm text-muted-foreground">Image coming soon</div>}</div><div className="flex flex-col justify-center py-4"><p className="eyebrow">AM11 Scents · Fragrance</p><h1 className="mt-4 display-title text-5xl sm:text-6xl">{product.title}</h1><p className="mt-5 text-xl">{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p><div className="gold-rule my-7" /><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{product.description || "A fragrance from the AM11 Scents collection. Product details will be updated as they are confirmed."}</p>{variant?.selectedOptions.map((option) => <p key={option.name} className="mt-5 text-sm"><span className="text-muted-foreground">{option.name}: </span>{option.value}</p>)}<div className="mt-8 flex items-center gap-4"><div className="flex h-12 items-center border border-input"><Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</Button><span className="w-8 text-center text-sm">{quantity}</span><Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>+</Button></div><Button className="h-12 flex-1" disabled={!variant || isLoading} onClick={() => void handleAdd()}>{added ? <><Check /> Added to bag</> : <>Add to bag <ArrowRight /></>}</Button></div>{error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}<p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4" /> Secure checkout through Shopify</p></div></div></section></StoreLayout>;
}