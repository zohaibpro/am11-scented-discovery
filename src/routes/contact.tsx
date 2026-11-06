import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StoreLayout } from "@/components/storefront";
import { CONTACT } from "@/lib/contact-info";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageMetadata("Contact | AM11 Scents", "Call, WhatsApp, email or visit AM11 Scents in Lahore for fragrance advice and order help."),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const cards = [
    { icon: Phone, title: "Call us", lines: [CONTACT.phone], href: CONTACT.phoneHref },
    { icon: MessageCircle, title: "WhatsApp", lines: ["Chat with a fragrance advisor"], href: CONTACT.whatsappHref },
    { icon: Mail, title: "Email", lines: [CONTACT.email, CONTACT.ordersEmail], href: `mailto:${CONTACT.email}` },
    { icon: MapPin, title: "Boutique", lines: [CONTACT.address] },
    { icon: Clock, title: "Hours", lines: CONTACT.hours },
  ];
  return (
    <StoreLayout>
      <section className="shop-container max-w-5xl py-14 sm:py-20">
        <p className="eyebrow">We are here to help</p>
        <h1 className="mt-3 display-title text-6xl">Let’s connect.</h1>
        <div className="mt-10 grid gap-12 border-y border-border py-10 md:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-6">
            {cards.map(({ icon: Icon, title, lines, href }) => (
              <div key={title} className="flex gap-4">
                <Icon className="mt-1 size-5 shrink-0 text-champagne" />
                <div>
                  <p className="font-display text-xl">{title}</p>
                  {lines.map((l) => href ? <a key={l} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block text-sm text-muted-foreground hover:text-foreground">{l}</a> : <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
                </div>
              </div>
            ))}
          </div>
          <form className="space-y-4 bg-secondary p-7 sm:p-9" onSubmit={(e) => { e.preventDefault(); setSent(true); (e.target as HTMLFormElement).reset(); toast.success("Thank you! We'll reply within 24 hours."); }}>
            <h2 className="font-display text-3xl">Send a message</h2>
            <input required name="name" placeholder="Your name" className="w-full border border-border bg-background px-4 py-3 text-sm" />
            <input required type="email" name="email" placeholder="Email address" className="w-full border border-border bg-background px-4 py-3 text-sm" />
            <select name="topic" className="w-full border border-border bg-background px-4 py-3 text-sm">
              <option>Fragrance recommendation</option><option>Order tracking</option><option>Gift sets</option><option>Other</option>
            </select>
            <textarea required name="message" rows={4} placeholder="How can we help?" className="w-full border border-border bg-background px-4 py-3 text-sm" />
            <Button type="submit" className="h-12 w-full">Send message</Button>
            {sent && <p className="text-center text-xs text-muted-foreground">Message received — we usually reply within a day.</p>}
          </form>
        </div>
      </section>
    </StoreLayout>
  );
}
