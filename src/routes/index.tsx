import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import heroImage from "@/assets/am11-fragrance-hero.jpg";
import { Button } from "@/components/ui/button";
import { EmptyHeroScrollLink, IntroBand, ProductGrid, StoreLayout } from "@/components/storefront";
import { getProducts, type ShopifyProduct } from "@/lib/shopify-storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => pageMetadata("AM11 Scents | Fragrance, with intention", "Explore the AM11 Scents fragrance collection, a considered edit of scents with a sense of presence."),
  component: HomePage,
});

function HomePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getProducts().then((data) => { if (active) setProducts(data); }).catch(() => { if (active) setError("The collection is temporarily unavailable."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <StoreLayout>
      <section className="hero-image relative min-h-[590px] overflow-hidden sm:min-h-[680px]" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="shop-container relative flex min-h-[590px] items-center sm:min-h-[680px]">
          <div className="max-w-xl py-16">
            <p className="eyebrow">A fragrance house in Pakistan</p>
            <h1 className="mt-6 display-title text-6xl sm:text-7xl">Leave a little<br /><span className="italic">wonder.</span></h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-foreground/80">Fragrance, with intention. Discover the AM11 Scents collection.</p>
            <Button size="lg" className="mt-8 h-12 px-7" asChild><Link to="/shop">Explore the collection <ArrowRight /></Link></Button>
            <EmptyHeroScrollLink />
          </div>
        </div>
        <span className="absolute bottom-7 right-7 hidden text-[0.65rem] uppercase tracking-[0.2em] text-foreground/60 sm:block">AM11 · Pakistan</span>
      </section>

      <section id="collection" className="shop-container scroll-mt-6 py-16 sm:py-24">
        <div className="mb-9 flex items-end justify-between gap-4">
          <div><p className="eyebrow">The collection</p><h2 className="mt-3 display-title text-4xl sm:text-5xl">Find your feeling.</h2></div>
          <Link to="/shop" className="hidden items-center gap-2 pb-1 text-sm md:inline-flex">Shop all <ArrowUpRight className="size-4" /></Link>
        </div>
        {loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] animate-pulse bg-secondary" />)}</div> : error ? <p className="border-y border-border py-12 text-center text-sm text-muted-foreground">{error} Please try again shortly.</p> : <ProductGrid products={products} />}
        <div className="mt-7 text-center md:hidden"><Button variant="outline" asChild><Link to="/shop">Shop all fragrances <ArrowRight /></Link></Button></div>
      </section>

      <IntroBand title="Made to be remembered." copy="AM11 Scents is a fragrance collection shaped around expression, presence and the small rituals that make a day your own. Discover each scent for yourself." action={<Button variant="outline" asChild><Link to="/about">A little about AM11 <ArrowRight /></Link></Button>} />

      <section className="shop-container grid gap-9 py-16 sm:grid-cols-[.9fr_1.1fr] sm:items-center sm:py-24">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img src={heroImage} alt="A refined fragrance bottle with jasmine petals" loading="lazy" width={1600} height={1100} className="size-full object-cover object-[70%_center]" />
        </div>
        <div className="sm:pl-12"><p className="eyebrow">The AM11 edit</p><h2 className="mt-4 display-title text-4xl sm:text-5xl">A scent is more than a note.</h2><p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">It is the atmosphere you bring into a room, the memory you carry home and the detail that feels entirely yours.</p><Link to="/shop" className="mt-7 inline-flex items-center gap-2 text-sm font-medium">Meet the collection <ArrowRight className="size-4" /></Link></div>
      </section>

      <section className="bg-primary py-14 text-primary-foreground sm:py-20">
        <div className="shop-container grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><Sparkles className="size-5 text-champagne" /><p className="eyebrow mt-5">A considered first impression</p><h2 className="mt-3 max-w-2xl display-title text-4xl sm:text-5xl">Your next favourite starts here.</h2></div><Button variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild><Link to="/shop">Explore AM11 <ArrowRight /></Link></Button></div>
      </section>
    </StoreLayout>
  );
}