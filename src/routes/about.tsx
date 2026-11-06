import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/am11-fragrance-hero.jpg";
import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageMetadata("Our Story | AM11 Scents", "Meet AM11 Scents, a fragrance collection rooted in personal expression and thoughtful discovery."),
  component: AboutPage,
});

function AboutPage() {
  return (
    <StoreLayout>
      <section className="shop-container grid min-h-[480px] gap-10 py-14 sm:grid-cols-[1fr_.9fr] sm:items-center sm:py-20">
        <div>
          <p className="eyebrow">A note from AM11</p>
          <h1 className="mt-4 display-title text-6xl">Fragrance,<br /><span className="italic">with intention.</span></h1>
          <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground">AM11 Scents is a fragrance collection built around the way scent makes a moment feel. We believe a fragrance can be an everyday ritual, a quiet signature and a way to express something words cannot.</p>
          <p className="mt-4 max-w-lg text-base leading-8 text-muted-foreground">We are here to help you find a scent that feels like your own.</p>
          <Button variant="outline" className="mt-7" asChild><Link to="/shop">Discover the collection <ArrowRight /></Link></Button>
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-secondary">
          <img src={heroImage} alt="A refined perfume bottle and jasmine petals" loading="lazy" width={1600} height={1100} className="size-full object-cover object-[70%_center]" />
        </div>
      </section>
    </StoreLayout>
  );
}