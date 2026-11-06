import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => pageMetadata("Privacy Policy | AM11 Scents", "Privacy information for visitors and customers of the AM11 Scents storefront."),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <StoreLayout><article className="shop-container max-w-3xl py-14 sm:py-20"><Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Home</Link><p className="eyebrow mt-10">Store policy</p><h1 className="mt-3 display-title text-6xl">Privacy</h1><p className="mt-8 text-sm leading-7 text-muted-foreground">Orders and checkout are handled by Shopify. Information entered during checkout is processed according to the privacy notices shown by Shopify and the store. AM11 Scents has not yet supplied a complete brand-specific privacy policy.</p><p className="mt-5 text-sm leading-7 text-muted-foreground">This page is a placeholder for the brand’s confirmed privacy terms and should be reviewed before the store begins taking customer orders.</p></article></StoreLayout>;
}