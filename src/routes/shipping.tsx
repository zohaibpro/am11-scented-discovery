import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/shipping")({
  head: () => pageMetadata("Shipping Policy | AM11 Scents", "Shipping information for AM11 Scents orders in Pakistan."),
  component: ShippingPage,
});

function ShippingPage() {
  return <StoreLayout><article className="shop-container max-w-3xl py-14 sm:py-20"><Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Home</Link><p className="eyebrow mt-10">Store policy</p><h1 className="mt-3 display-title text-6xl">Shipping</h1><p className="mt-8 text-sm leading-7 text-muted-foreground">AM11 Scents has not yet confirmed delivery areas, shipping charges or estimated delivery times. Available shipping options and any applicable charges will be displayed during Shopify checkout. Please confirm the delivery details shown there before placing your order.</p><p className="mt-5 text-sm leading-7 text-muted-foreground">This page will be updated when the brand provides its official shipping terms.</p></article></StoreLayout>;
}