import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StoreLayout } from "@/components/storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => pageMetadata("Frequently Asked Questions | AM11 Scents", "Answers to common questions about AM11 Scents orders, delivery, payments, fragrance details and returns."),
  component: FaqPage,
});

const answers = [
  ["How do I place an order?", "Add an available fragrance to your bag, review the order and continue to the secure Shopify checkout. Delivery details are entered there."],
  ["Where do you deliver?", "We deliver across Pakistan in 1–5 working days. Shipping is free on orders over Rs 10,000."],
  ["Which payment methods can I use?", "Cash on delivery plus the payment options shown at checkout."],
  ["Where can I find fragrance notes and sizes?", "Each product page lists top, heart and base notes, and every scent comes in 50ml and 100ml."],
  ["Can I return or exchange an order?", "Yes — unopened bottles within 7 days of delivery. See our returns page."],
  ["How can I contact AM11 Scents?", "Call or WhatsApp +92 300 8412111, or email concierge@am11scents.com."],
];

function FaqPage() {
  return <StoreLayout><section className="shop-container max-w-4xl py-14 sm:py-20"><p className="eyebrow">A little clarity</p><h1 className="mt-3 display-title text-6xl">Good to know.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Answers about the collection and placing an order with AM11 Scents.</p><Accordion type="single" collapsible className="mt-10 border-t border-border">{answers.map(([question, answer], index) => <AccordionItem key={question} value={`item-${index}`} className="border-b border-border"><AccordionTrigger className="py-5 text-left font-display text-xl hover:no-underline">{question}</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 text-sm leading-7 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion><div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-8"><p className="text-sm text-muted-foreground">Browse the current collection.</p><Button variant="outline" asChild><Link to="/shop">Shop fragrances <ArrowRight /></Link></Button></div></section></StoreLayout>;
}