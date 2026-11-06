import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => pageMetadata("Privacy Policy | AM11 Scents", "Privacy information for visitors and customers of the AM11 Scents storefront."),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <StoreLayout><article className="shop-container max-w-3xl py-14 sm:py-20"><Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Home</Link><p className="eyebrow mt-10">Store policy</p><h1 className="mt-3 display-title text-6xl">Privacy</h1><p className="mt-8 text-sm leading-7 text-muted-foreground">Orders and checkout are handled by Shopify. Information entered during checkout is processed according to the privacy notices shown by Shopify and the store. We only use your name, phone, email and address to deliver your order and reply to enquiries. We never sell your data. To request deletion, email concierge@am11scents.com.</p></article></StoreLayout>;
}