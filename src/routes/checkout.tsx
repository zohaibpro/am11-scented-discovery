import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, LockKeyhole, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { StoreLayout, money } from "@/components/storefront";
import { useCartStore } from "@/lib/cart-store";
import { formatCheckoutUrl } from "@/lib/shopify-storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/checkout")({
  head: () => pageMetadata("Checkout | AM11 Scents", "Review your AM11 Scents order before continuing to Shopify checkout."),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, checkoutUrl, isLoading, error } = useCartStore();
  const [ready, setReady] = useState(false);
  useEffect(() => { void useCartStore.persist.rehydrate().finally(() => setReady(true)); }, []);
  const total = items.reduce((sum, item) => sum + Number(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "PKR";

  const goToCheckout = () => {
    if (!checkoutUrl) return;
    window.open(formatCheckoutUrl(checkoutUrl), "_blank", "noopener,noreferrer");
  };

  return <StoreLayout><section className="shop-container max-w-5xl py-12 sm:py-16"><Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Continue shopping</Link><div className="mt-8 grid gap-10 md:grid-cols-[1.15fr_.85fr]"><div><p className="eyebrow">Almost yours</p><h1 className="mt-3 display-title text-5xl">Order review</h1><p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Your delivery details and available payment methods will be collected securely in Shopify checkout.</p>{!ready ? <div className="mt-8 h-24 animate-pulse bg-secondary" /> : items.length ? <div className="mt-8 divide-y divide-border border-y border-border">{items.map((item) => <div key={item.variantId} className="flex items-center gap-4 py-4"><div className="size-16 shrink-0 bg-secondary">{item.product.images.edges[0]?.node && <img className="size-full object-cover" src={item.product.images.edges[0].node.url} alt={item.product.title} />}</div><div className="min-w-0 flex-1"><p className="font-display text-xl">{item.product.title}</p><p className="text-xs text-muted-foreground">{item.variantTitle} · Qty {item.quantity}</p></div><span className="text-sm">{money(String(Number(item.price.amount) * item.quantity), item.price.currencyCode)}</span></div>)}</div> : <div className="mt-8 border-y border-border py-12 text-center"><ShoppingBag className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-4 font-display text-2xl">Your bag is empty</h2><Button className="mt-5" asChild><Link to="/shop">Explore fragrances</Link></Button></div>}</div><aside className="h-fit border border-border p-6 sm:p-8"><p className="eyebrow">Summary</p><h2 className="mt-2 font-display text-3xl">Your order</h2><div className="mt-7 space-y-3 border-b border-border pb-6 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{money(String(total), currency)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Calculated at checkout</span></div></div><div className="flex justify-between py-5 font-medium"><span>Total</span><span>{money(String(total), currency)}</span></div>{error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}<Button className="h-12 w-full" disabled={!items.length || !checkoutUrl || isLoading} onClick={goToCheckout}>Continue to Shopify checkout <ArrowUpRight /></Button><p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><LockKeyhole className="size-3" /> Secure checkout hosted by Shopify</p><p className="mt-5 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">AM11 Scents has not provided a WhatsApp number yet. Checkout is handled securely through the connected Shopify store.</p></aside></div></section></StoreLayout>;
}