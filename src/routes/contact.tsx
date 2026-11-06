import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageMetadata("Contact | AM11 Scents", "Get in touch with AM11 Scents for questions about the fragrance collection or your order."),
  component: ContactPage,
});

function ContactPage() {
  return <StoreLayout><section className="shop-container max-w-5xl py-14 sm:py-20"><p className="eyebrow">We are here to help</p><h1 className="mt-3 display-title text-6xl">Let’s connect.</h1><div className="mt-10 grid gap-12 border-y border-border py-10 md:grid-cols-[.8fr_1.2fr]"><div><MessageCircle className="size-7 text-champagne" /><h2 className="mt-5 font-display text-3xl">A question about AM11?</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">We would love to help with a fragrance or order enquiry. The official WhatsApp number and email address have not been provided yet, so we have not added an unverified contact link.</p><p className="mt-6 text-sm">Please check back for the official contact channel.</p></div><div className="bg-secondary p-7 sm:p-9"><p className="eyebrow">The collection</p><h2 className="mt-3 font-display text-3xl">In the meantime</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Explore the available fragrances and see confirmed product details and prices in the shop.</p><Button className="mt-6" asChild><Link to="/shop">Visit the shop <ArrowRight /></Link></Button></div></div></section></StoreLayout>;
}