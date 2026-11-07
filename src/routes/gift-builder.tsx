import { createFileRoute } from "@tanstack/react-router";
import { Gift, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { money, StoreLayout } from "@/components/storefront";
import { useCartStore } from "@/lib/cart-store";
import { getProducts, type ShopifyProduct } from "@/lib/shopify-storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/gift-builder")({
  head: () => pageMetadata("Build a Gift Set | AM11 Scents", "Choose three AM11 fragrances and create a personal gift set in a few taps."),
  component: GiftBuilderPage,
});

const SLOTS = 3;

function GiftBuilderPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [picked, setPicked] = useState<ShopifyProduct[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [addingSet, setAddingSet] = useState(false);
  const { addItem, updateCartNote, isLoading } = useCartStore();
  useEffect(() => {
    let active = true;
    getProducts().then((data) => { if (active) setProducts(data); }).catch(() => { if (active) setLoadError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const variantOf = (p: ShopifyProduct) => p.variants.edges.find((e) => e.node.availableForSale)?.node;
  const selectableProducts = products.filter((product) => variantOf(product));
  const total = picked.reduce((s, p) => s + Number(variantOf(p)?.price.amount ?? 0), 0);
  const currency = picked[0] ? variantOf(picked[0])?.price.currencyCode ?? "PKR" : "PKR";

  const toggle = (p: ShopifyProduct) => {
    if (picked.some((x) => x.id === p.id)) setPicked(picked.filter((x) => x.id !== p.id));
    else if (picked.length < SLOTS) setPicked([...picked, p]);
    else toast("Your set is full — remove one to swap.");
  };

  const addSet = async () => {
    setAddingSet(true);
    try {
      for (const p of picked) {
        const v = variantOf(p);
        if (!v) continue;
        await addItem({ product: p, variantId: v.id, variantTitle: v.title, price: v.price, quantity: 1, selectedOptions: v.selectedOptions });
        const error = useCartStore.getState().error;
        if (error) {
          toast.error(`Could not add ${p.title}: ${error}`);
          return;
        }
      }
      if (note.trim()) {
        await updateCartNote(note.trim());
        const error = useCartStore.getState().error;
        if (error) {
          toast.error(`Your fragrances are in the bag, but the gift note could not be saved: ${error}`);
          setPicked([]);
          return;
        }
      }
      toast.success("Gift set added to your bag");
      setPicked([]);
      setNote("");
    } finally {
      setAddingSet(false);
    }
  };

  return (
    <StoreLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="shop-container py-14 text-center sm:py-20">
          <Gift className="mx-auto size-5 text-champagne" />
          <p className="eyebrow mt-4">Gift builder</p>
          <h1 className="mt-3 display-title text-5xl sm:text-6xl">Curate a trio.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">Pick three fragrances, add a note, and send the whole set to your bag at once.</p>
        </div>
      </section>

      <section className="shop-container grid gap-10 py-14 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          {loading ? <div className="grid grid-cols-2 gap-5 md:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="aspect-[4/5] animate-pulse bg-secondary" />)}</div> : loadError ? <p role="alert" className="border-y border-border py-12 text-center text-sm text-muted-foreground">The collection is temporarily unavailable. Please try again shortly.</p> : selectableProducts.length === 0 ? <p className="border-y border-border py-12 text-center text-sm text-muted-foreground">No available fragrances can be added to a gift set right now.</p> : <div className="grid grid-cols-2 gap-5 md:grid-cols-3">{selectableProducts.map((p) => {
            const on = picked.some((x) => x.id === p.id);
            const v = variantOf(p);
            return (
              <Button key={p.id} type="button" variant="ghost" aria-pressed={on} onClick={() => toggle(p)} className={`group relative h-auto w-full flex-col overflow-hidden whitespace-normal border p-0 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${on ? "border-foreground ring-2 ring-champagne" : "border-border"}`}>
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  {p.images.edges[0] && <img src={p.images.edges[0].node.url} alt={p.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                <span className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full ${on ? "bg-primary text-primary-foreground" : "bg-background"}`}>{on ? <X className="size-4" /> : <Plus className="size-4" />}</span>
                <div className="p-4"><p className="font-display text-xl leading-tight">{p.title}</p><p className="mt-1 text-xs text-muted-foreground">{p.productType} · {v ? money(v.price.amount, v.price.currencyCode) : "—"}</p></div>
              </Button>
            );
          })}</div>}
        </div>

        <aside className="sticky top-6 border border-border bg-background p-6">
          <p className="eyebrow">Your set</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {Array.from({ length: SLOTS }).map((_, i) => {
              const p = picked[i];
              return <div key={i} className="aspect-square overflow-hidden border border-dashed border-border bg-secondary/50">{p ? <img src={p.images.edges[0]?.node.url} alt={p.title} className="size-full object-cover" /> : <span className="grid size-full place-items-center text-xs text-muted-foreground">{i + 1}</span>}</div>;
            })}
          </div>
          <ul className="mt-5 space-y-2 text-sm">{picked.map((p) => <li key={p.id} className="flex justify-between gap-2"><span>{p.title}</span><span className="text-muted-foreground">{money(variantOf(p)?.price.amount ?? "0", currency)}</span></li>)}</ul>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={160} placeholder="Gift note (optional)" className="mt-5 h-20 w-full resize-none border border-border bg-background p-3 text-sm outline-none focus:border-foreground" />
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium"><span>Total</span><span>{money(String(total), currency)}</span></div>
          <Button className="mt-5 w-full" disabled={picked.length < SLOTS || isLoading || addingSet || loading || loadError} onClick={() => void addSet()}><ShoppingBag /> {addingSet ? "Adding your set…" : picked.length < SLOTS ? `Pick ${SLOTS - picked.length} more` : "Add set to bag"}</Button>
        </aside>
      </section>
    </StoreLayout>
  );
}
