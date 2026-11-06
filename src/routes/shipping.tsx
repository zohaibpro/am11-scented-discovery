import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/shipping")({
  head: () => pageMetadata("Shipping Policy | AM11 Scents", "Nationwide delivery across Pakistan, free on orders over Rs 10,000."),
  component: ShippingPage,
});

const rows = [
  ["Lahore", "1–2 working days", "Rs 200"],
  ["Karachi, Islamabad, Rawalpindi", "2–3 working days", "Rs 250"],
  ["Rest of Pakistan", "3–5 working days", "Rs 300"],
];

function ShippingPage() {
  return <StoreLayout><article className="shop-container max-w-3xl py-14 sm:py-20"><Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Home</Link><p className="eyebrow mt-10">Store policy</p><h1 className="mt-3 display-title text-6xl">Shipping</h1><p className="mt-8 text-sm leading-7 text-muted-foreground">We deliver nationwide across Pakistan. Orders over <strong>Rs 10,000 ship free</strong>. Orders placed before 2 PM are dispatched the same working day, and every parcel includes a tracking number.</p><table className="mt-8 w-full text-left text-sm"><thead><tr className="border-b border-border"><th className="py-3">Area</th><th>Delivery time</th><th>Charge</th></tr></thead><tbody>{rows.map((r) => <tr key={r[0]} className="border-b border-border">{r.map((c) => <td key={c} className="py-3 text-muted-foreground">{c}</td>)}</tr>)}</tbody></table><p className="mt-6 text-sm leading-7 text-muted-foreground">Cash on delivery is available on all orders. Every order comes with a complimentary discovery tester.</p></article></StoreLayout>;
}
