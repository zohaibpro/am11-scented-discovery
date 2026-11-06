import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/returns")({
  head: () => pageMetadata("Returns & Refunds | AM11 Scents", "Read the AM11 Scents return and refund information before placing an order."),
  component: ReturnsPage,
});

function ReturnsPage() {
  return <StoreLayout><article className="shop-container max-w-3xl py-14 sm:py-20"><Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Home</Link><p className="eyebrow mt-10">Store policy</p><h1 className="mt-3 display-title text-6xl">Returns & refunds</h1><p className="mt-8 text-sm leading-7 text-muted-foreground">Unopened, sealed bottles can be returned or exchanged within 7 days of delivery. Refunds are processed within 5 working days after we receive the item.</p><p className="mt-5 text-sm leading-7 text-muted-foreground">If your bottle arrives damaged or leaking, send a photo to orders@am11scents.com or WhatsApp +92 300 8412111 within 48 hours and we will replace it free of charge.</p></article></StoreLayout>;
}