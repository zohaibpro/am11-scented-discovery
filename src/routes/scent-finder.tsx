import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProductCard, StoreLayout } from "@/components/storefront";
import { getProducts, type ShopifyProduct } from "@/lib/shopify-storefront";
import { pageMetadata } from "@/lib/seo";

export const Route = createFileRoute("/scent-finder")({
  head: () => pageMetadata("Scent Finder Quiz | AM11 Scents", "Answer four quick questions and discover the AM11 fragrance that matches your mood and style."),
  component: ScentFinderPage,
});

type Family = "Woody & Oud" | "Floral" | "Amber & Spicy" | "Fresh & Citrus";
const questions: { q: string; options: { label: string; hint: string; family: Family }[] }[] = [
  { q: "When will you wear it most?", options: [
    { label: "Evenings out", hint: "Dinners, events, celebrations", family: "Amber & Spicy" },
    { label: "Every day", hint: "Office, errands, coffee", family: "Fresh & Citrus" },
    { label: "Special occasions", hint: "Weddings, Eid, milestones", family: "Woody & Oud" },
    { label: "Weekends", hint: "Slow mornings, gardens", family: "Floral" },
  ] },
  { q: "Which mood calls to you?", options: [
    { label: "Bold & regal", hint: "Commanding presence", family: "Woody & Oud" },
    { label: "Romantic", hint: "Soft and dreamy", family: "Floral" },
    { label: "Warm & sensual", hint: "Cosy and magnetic", family: "Amber & Spicy" },
    { label: "Bright & clean", hint: "Fresh and energised", family: "Fresh & Citrus" },
  ] },
  { q: "Pick a scene.", options: [
    { label: "A sunlit orchard", hint: "Zest and green leaves", family: "Fresh & Citrus" },
    { label: "A rose garden at dusk", hint: "Petals and dew", family: "Floral" },
    { label: "An ancient library", hint: "Wood, leather, smoke", family: "Woody & Oud" },
    { label: "A spice bazaar", hint: "Saffron and resin", family: "Amber & Spicy" },
  ] },
  { q: "How noticeable should it be?", options: [
    { label: "A whisper", hint: "Close to the skin", family: "Fresh & Citrus" },
    { label: "Gentle trail", hint: "Noticed when near", family: "Floral" },
    { label: "Confident", hint: "Fills the room softly", family: "Amber & Spicy" },
    { label: "Unforgettable", hint: "Lingers long after", family: "Woody & Oud" },
  ] },
];

function ScentFinderPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Family[]>([]);
  useEffect(() => { getProducts().then(setProducts).catch(() => setProducts([])); }, []);

  const done = answers.length === questions.length;
  const ranking = useMemo(() => {
    const counts: Record<string, number> = {};
    answers.forEach((f) => { counts[f] = (counts[f] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [answers]);
  const topFamily = ranking[0]?.[0];
  const matchPct = ranking[0] ? Math.round((ranking[0][1] / questions.length) * 100) : 0;
  const matches = products.filter((p) => p.productType === topFamily);
  const others = products.filter((p) => p.productType === ranking[1]?.[0]).slice(0, 2);

  const choose = (family: Family) => {
    const next = [...answers.slice(0, step), family];
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
  };
  const reset = () => { setAnswers([]); setStep(0); };

  return (
    <StoreLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="shop-container py-14 text-center sm:py-20">
          <Sparkles className="mx-auto size-5 text-champagne" />
          <p className="eyebrow mt-4">Scent Finder</p>
          <h1 className="mt-3 display-title text-5xl sm:text-6xl">Find your signature.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">Four quick questions. One fragrance that feels like you.</p>
        </div>
      </section>

      <section className="shop-container max-w-4xl py-14 sm:py-20">
        {!done ? (
          <div>
            <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span>Question {step + 1} of {questions.length}</span>
              {step > 0 && <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setStep(step - 1)}><ArrowLeft className="size-3" /> Back</button>}
            </div>
            <div className="h-1 w-full bg-secondary"><div className="h-1 bg-primary transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
            <h2 className="mt-10 text-center display-title text-4xl">{questions[step].q}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {questions[step].options.map((o) => (
                <button key={o.label} onClick={() => choose(o.family)} className={`group border p-6 text-left transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-lg ${answers[step] === o.family ? "border-foreground bg-secondary" : "border-border bg-background"}`}>
                  <span className="block font-display text-2xl">{o.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{o.hint}</span>
                  <ArrowRight className="mt-4 size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <p className="eyebrow">Your scent family</p>
              <h2 className="mt-3 display-title text-5xl">{topFamily}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{matchPct}% match with your answers</p>
              <div className="mx-auto mt-5 h-2 max-w-xs bg-secondary"><div className="h-2 bg-champagne" style={{ width: `${matchPct}%` }} /></div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3">
              {(matches.length ? matches : products.slice(0, 3)).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {others.length > 0 && (<><h3 className="mt-16 display-title text-3xl">You may also love</h3><div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3">{others.map((p) => <ProductCard key={p.id} product={p} />)}</div></>)}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={reset}><RotateCcw /> Retake quiz</Button>
              <Button asChild><Link to="/gift-builder">Build a gift set <ArrowRight /></Link></Button>
            </div>
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
