import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, ChevronDown, Menu, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import type { ShopifyProduct } from "@/lib/shopify-storefront";

export function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(Number(amount));
}

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCartStore();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      <div className="bg-primary py-2 text-center text-[0.65rem] font-medium uppercase tracking-[0.15em] text-primary-foreground">
        AM11 Scents · Fragrance, with intention
      </div>
      <header className="relative z-30 border-b border-border bg-background">
        <div className="shop-container flex h-[76px] items-center justify-between gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
          <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Main navigation">
            <Link className="shop-link" to="/shop">Shop</Link>
            <Link className="shop-link" to="/about">Our story</Link>
            <Link className="shop-link" to="/faq">FAQ</Link>
          </nav>
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label="AM11 Scents home">
            <span className="block font-display text-[1.85rem] leading-none tracking-[0.02em]">AM11</span>
            <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.35em]">Scents</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/shop" aria-label="Search the shop" className="hidden md:inline-flex">
              <Button variant="ghost" size="icon" aria-label="Shop"><Search /></Button>
            </Link>
            <CartPanel count={count} />
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-background px-6 py-5 md:hidden" aria-label="Mobile navigation">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm">
              <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop all</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>Our story</Link>
              <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

function CartPanel({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  const { items, updateQuantity, removeItem, isLoading, error } = useCartStore();
  const total = items.reduce((sum, item) => sum + Number(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "PKR";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Shopping bag, ${count} items`} className="relative">
          <ShoppingBag />
          {count > 0 && <span className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{count}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="left-auto right-0 top-0 h-dvh w-full max-w-md translate-x-0 translate-y-0 overflow-y-auto rounded-none border-l border-border p-0">
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b border-border px-6 py-5 text-left">
            <DialogTitle className="font-display text-3xl">Your bag <span className="font-sans text-sm text-muted-foreground">({count})</span></DialogTitle>
            <DialogDescription>Thoughtfully chosen, beautifully yours.</DialogDescription>
          </DialogHeader>
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <ShoppingBag className="mb-4 size-8 text-muted-foreground" />
              <p className="font-display text-2xl">Your bag is waiting</p>
              <p className="mt-2 text-sm text-muted-foreground">Explore the collection and find your next signature scent.</p>
              <Button asChild className="mt-6"><Link to="/shop" onClick={() => setOpen(false)}>Explore the collection</Link></Button>
            </div>
          ) : (
            <>
              <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
                {items.map((item) => <CartLine key={item.variantId} item={item} onRemove={() => void removeItem(item.variantId)} onQuantity={(quantity) => void updateQuantity(item.variantId, quantity)} />)}
              </div>
              <div className="border-t border-border p-6">
                {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{money(String(total), currency)}</span></div>
                <p className="mt-2 text-xs text-muted-foreground">Shipping and taxes are calculated at checkout.</p>
                <Button className="mt-5 h-12 w-full" disabled={isLoading} onClick={() => setOpen(false)} asChild>
                  <Link to="/checkout">Continue to checkout <ArrowRight /></Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CartLine({ item, onRemove, onQuantity }: { item: CartItem; onRemove: () => void; onQuantity: (quantity: number) => void }) {
  const image = item.product.images.edges[0]?.node;
  return (
    <div className="flex gap-4 py-5">
      <div className="size-20 shrink-0 overflow-hidden bg-secondary">
        {image && <img src={image.url} alt={image.altText ?? item.product.title} className="size-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <Link to="/product/$handle" params={{ handle: item.product.handle }} className="text-sm font-medium">{item.product.title}</Link>
        <p className="mt-1 text-xs text-muted-foreground">{item.variantTitle}</p>
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-7" onClick={() => onQuantity(item.quantity - 1)} aria-label="Decrease quantity"><Minus /></Button>
          <span className="w-5 text-center text-sm">{item.quantity}</span>
          <Button variant="outline" size="icon" className="size-7" onClick={() => onQuantity(item.quantity + 1)} aria-label="Increase quantity"><Plus /></Button>
          <Button variant="ghost" size="icon" className="ml-auto size-7" onClick={onRemove} aria-label={`Remove ${item.product.title}`}><Trash2 /></Button>
        </div>
      </div>
      <span className="shrink-0 text-sm">{money(String(Number(item.price.amount) * item.quantity), item.price.currencyCode)}</span>
    </div>
  );
}

export function StoreFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="shop-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-4xl">AM11 Scents</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/75">A considered collection of fragrances for the moments that stay with you.</p>
        </div>
        <div>
          <p className="eyebrow">Discover</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link to="/shop">Shop all</Link><Link to="/about">Our story</Link><Link to="/faq">Frequently asked questions</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Care</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link to="/contact">Contact</Link><Link to="/shipping">Shipping policy</Link><Link to="/returns">Returns</Link><Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="shop-container border-t border-primary-foreground/20 py-5 text-xs text-primary-foreground/70">© {new Date().getFullYear()} AM11 Scents · Pakistan</div>
    </footer>
  );
}

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div className="site-shell"><StoreHeader /><main>{children}</main><StoreFooter /></div>;
}

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem, isLoading } = useCartStore();
  const variant = product.variants.edges.find((entry) => entry.node.availableForSale)?.node;
  const image = product.images.edges[0]?.node;
  return (
    <article className="group min-w-0">
      <Link to="/product/$handle" params={{ handle: product.handle }} className="product-image block">
        {image ? <img src={image.url} alt={image.altText ?? product.title} loading="lazy" /> : <div className="grid size-full place-items-center text-sm text-muted-foreground">Image coming soon</div>}
      </Link>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0"><Link to="/product/$handle" params={{ handle: product.handle }} className="font-display text-xl leading-tight">{product.title}</Link><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description || "A fragrance from the AM11 Scents collection."}</p></div>
        <span className="shrink-0 pt-1 text-sm">{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</span>
      </div>
      <Button variant="outline" className="mt-4 w-full" disabled={!variant || isLoading} onClick={() => variant && void addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions })}>
        {variant ? <><ShoppingBag /> Add to bag</> : "Unavailable"}
      </Button>
    </article>
  );
}

export function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="border-y border-border py-20 text-center">
        <p className="eyebrow">The collection</p>
        <h2 className="mt-3 font-display text-4xl">No products found</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">The Shopify catalog is empty right now. Add AM11 Scents products with their confirmed prices in Shopify to have them appear here.</p>
      </div>
    );
  }
  return <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

export function ShopGrid({ products }: { products: ShopifyProduct[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All fragrances");
  const [sort, setSort] = useState("featured");
  const categories = useMemo(() => ["All fragrances", ...new Set(products.map((product) => product.productType).filter(Boolean))], [products]);
  const filtered = useMemo(() => {
    const matches = products.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()) && (category === "All fragrances" || product.productType === category));
    if (sort === "price-low") matches.sort((a, b) => Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount));
    if (sort === "price-high") matches.sort((a, b) => Number(b.priceRange.minVariantPrice.amount) - Number(a.priceRange.minVariantPrice.amount));
    if (sort === "name") matches.sort((a, b) => a.title.localeCompare(b.title));
    return matches;
  }, [products, search, category, sort]);
  return (
    <>
      <div className="flex flex-col gap-4 border-y border-border py-5 sm:flex-row sm:items-center">
        <label className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-11 pl-10" placeholder="Search fragrances" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search fragrances" /></label>
        <label className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Category</span><select className="h-11 min-w-40 border border-input bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Sort</span><select className="h-11 min-w-40 border border-input bg-background px-3 text-sm" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="name">Name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
      </div>
      <p className="py-5 text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "fragrance" : "fragrances"}</p>
      {filtered.length ? <ProductGrid products={filtered} /> : <p className="border-y border-border py-16 text-center text-muted-foreground">No fragrances match your search.</p>}
    </>
  );
}

export function IntroBand({ title, copy, action }: { title: string; copy: string; action?: React.ReactNode }) {
  return <section className="bg-secondary py-16 sm:py-20"><div className="shop-container grid gap-6 md:grid-cols-[1fr_1fr] md:items-end"><div><p className="eyebrow">AM11 Scents</p><h2 className="mt-3 max-w-xl display-title text-4xl sm:text-5xl">{title}</h2></div><div><p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{copy}</p>{action && <div className="mt-6">{action}</div>}</div></div></section>;
}

export function EmptyHeroScrollLink() {
  return <a href="#collection" className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">Discover the collection <ArrowDown className="size-4" /></a>;
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4 text-champagne" />{children}</div>;
}