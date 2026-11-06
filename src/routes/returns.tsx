import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/returns")({
  head: () => pageMetadata("Returns & Refunds | AM11 Scents", "Read the AM11 Scents return and refund information before placing an order."),
  component: ReturnsPage,
});

function ReturnsPage() {
  return <StoreLayout><article className="shop-container max-w-3xl py-14 sm:py-20"><Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Home</Link><p className="eyebrow mt-10">Store policy</p><h1 className="mt-3 display-title text-6xl">Returns & refunds</h1><p className="mt-8 text-sm leading-7 text-muted-foreground">AM11 Scents has not provided confirmed return, exchange or refund terms. We will publish the official policy here when it is available. Please review the terms presented by the store before placing your order.</p><p className="mt-5 text-sm leading-7 text-muted-foreground">No return eligibility or refund timeframe is promised on this page.</p></article></StoreLayout>;
}