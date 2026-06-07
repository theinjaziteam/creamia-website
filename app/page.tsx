"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarqueeBar from "../components/MarqueeBar";
import AnimatedSection from "../components/AnimatedSection";

// ─── Types ─────────────────────────────────────────────────────────────────────

type CartItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  qty: number;
  image: string | null;
};

type OrderForm = {
  name: string;
  phone: string;
  area: string;
  date: string;
  notes: string;
};

type BundlePlan = {
  id: string;
  name: string;
  count: number;
  desc: string;
  bg: string;
  accent: string;
  textColor: string;
  subtextColor: string;
  border: string;
  classicRef: number;
  premiumRef: number;
};

// ─── Data ───────────────────────────────────────────────────────────────────────

const allFlavors: {
  id: string;
  name: string;
  desc: string;
  boxPrice: number;
  trayPrice: number | null;
  tier: "classic" | "premium";
  category: "oriental" | "creamy" | "fluffy";
  image: string | null;
}[] = [
  { id: "moufataka",         name: "Moufataka",               desc: "Lebanese classic — rice pudding, caramel, nuts.",              boxPrice: 4, trayPrice: null, tier: "classic", category: "oriental", image: null },
  { id: "kunafa",            name: "Kunafa",                  desc: "Crisp shredded pastry, sweet cheese, rosewater syrup.",        boxPrice: 4, trayPrice: null, tier: "classic", category: "oriental", image: null },
  { id: "halawet-riz",       name: "Halawet el Riz",          desc: "Traditional Levantine rice cream, sweetened with rose.",        boxPrice: 4, trayPrice: null, tier: "classic", category: "oriental", image: null },

  { id: "tiramisu-classic",  name: "Classic Tiramisu",        desc: "Espresso-soaked ladyfingers, mascarpone cream, dark cocoa.",   boxPrice: 6, trayPrice: 13,   tier: "premium", category: "creamy", image: null },
  { id: "tiramisu-brownie",  name: "Brownie Tiramisu",        desc: "Fudgy brownie base meets tiramisu cream, perfectly layered.",  boxPrice: 7, trayPrice: 15,   tier: "premium", category: "creamy", image: null },
  { id: "lotus-cheese",      name: "Lotus Cheesecake",        desc: "Biscoff crust, velvety cream cheese, drizzle of Lotus gold.",  boxPrice: 6, trayPrice: 13,   tier: "premium", category: "creamy", image: null },
  { id: "oreo-cheese",       name: "Oreo Cheesecake",         desc: "Crushed Oreo crust, thick cream cheese, chocolate crumble.",   boxPrice: 6, trayPrice: 13,   tier: "premium", category: "creamy", image: null },
  { id: "blueberry-cheese",  name: "Blueberry Cheesecake",    desc: "Tart blueberry compote swirled into creamy cheesecake.",       boxPrice: 6, trayPrice: 13,   tier: "premium", category: "creamy", image: null },
  { id: "raspberry-cheese",  name: "Raspberry Cheesecake",    desc: "Tangy raspberry coulis ribboned through silky cheesecake.",    boxPrice: 6, trayPrice: 13,   tier: "premium", category: "creamy", image: null },
  { id: "choc-dubai",        name: "Chocolate Dubai Cake",    desc: "Rich chocolate layered with crispy kataifi and pistachio.",    boxPrice: 6, trayPrice: 13,   tier: "premium", category: "creamy", image: null },

  { id: "halawa-bav",        name: "Halawa Bavaroise",        desc: "Lebanese halawa whipped into silky bavaroise cream.",           boxPrice: 4, trayPrice: 10,   tier: "classic", category: "fluffy", image: null },
  { id: "strawberry-mousse", name: "Strawberry Bavaroise",    desc: "Silky strawberry bavaroise over a buttery biscuit base.",       boxPrice: 4, trayPrice: 10,   tier: "classic", category: "fluffy", image: null },
  { id: "mango-bav",         name: "Mango Bavaroise",         desc: "Tropical mango bavaroise with a light vanilla finish.",         boxPrice: 4, trayPrice: 10,   tier: "classic", category: "fluffy", image: null },
  { id: "banana-bav",        name: "Banana Bavaroise",        desc: "Velvet banana bavaroise with caramelised biscuit crumble.",     boxPrice: 4, trayPrice: 10,   tier: "classic", category: "fluffy", image: null },
];

const menuCategories: { id: "oriental" | "creamy" | "fluffy"; label: string; notes: string[] }[] = [
  { id: "oriental", label: "Oriental Boxes", notes: ["Solo Box  (1 serving)  ~200g"] },
  { id: "creamy",   label: "Creamy Boxes",   notes: ["Solo Box  (1 serving)  ~180g", "Tray  (2–3 servings)  ~450–500g"] },
  { id: "fluffy",   label: "Fluffy Collection", notes: ["Solo Box  (1 serving)  ~150g", "Tray  (2–3 servings)  ~350–400g"] },
];

const bundlePlans: BundlePlan[] = [
  {
    id: "cozy",
    name: "Cozy Box",
    count: 4,
    desc: "Perfect for two — or just you.",
    bg: "#FAF4EC",
    accent: "#C4622D",
    textColor: "#261408",
    subtextColor: "#6B4F3A",
    border: "1px solid rgba(160,120,90,0.2)",
    classicRef: 14,
    premiumRef: 20,
  },
  {
    id: "gathering",
    name: "Gathering Box",
    count: 6,
    desc: "Bring joy to every table.",
    bg: "#4A1118",
    accent: "#E8956D",
    textColor: "#FFFFFF",
    subtextColor: "rgba(255,255,255,0.55)",
    border: "none",
    classicRef: 21,
    premiumRef: 27,
  },
  {
    id: "celebration",
    name: "Celebration Box",
    count: 12,
    desc: "For the moments that deserve more.",
    bg: "#11141F",
    accent: "#C9A87C",
    textColor: "#FFFFFF",
    subtextColor: "rgba(255,255,255,0.5)",
    border: "none",
    classicRef: 40,
    premiumRef: 50,
  },
];

const deliveryAreas = [
  "Beirut — Central",
  "Beirut — Hamra",
  "Beirut — Achrafieh",
  "Beirut — Gemmayzeh",
  "Mount Lebanon",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calcTotal(cart: CartItem[]): number {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount(cart: CartItem[]): number {
  return cart.reduce((s, i) => s + i.qty, 0);
}

// ─── Navbar ─────────────────────────────────────────────────────────────────────

function Navbar({ cart, onCartClick }: { cart: CartItem[]; onCartClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const count = cartCount(cart);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.8125rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    color: scrolled ? "var(--text-mid)" : "rgba(255,255,255,0.85)",
    textDecoration: "none",
    textTransform: "uppercase",
    transition: "color 0.2s",
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem",
      background: scrolled ? "rgba(250,248,244,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "background 0.4s, border-color 0.4s",
    }}>
      <a href="#" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "'Lobster', cursive",
          fontSize: "1.625rem", fontWeight: 400,
          color: scrolled ? "var(--text)" : "#fff",
          letterSpacing: "0", transition: "color 0.3s",
        }}>
          Cremia
        </span>
      </a>

      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="nav-links">
        {([ ["Bundles", "#bundles"], ["Menu", "#menu"], ["Story", "#story"] ] as [string, string][]).map(([label, href]) => (
          <a key={label} href={href} style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text-mid)" : "rgba(255,255,255,0.85)")}>
            {label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <a href="https://instagram.com/Cremia_lb" target="_blank" rel="noopener noreferrer"
          style={{ color: scrolled ? "var(--text-soft)" : "rgba(255,255,255,0.75)", transition: "color 0.2s", display: "flex" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text-soft)" : "rgba(255,255,255,0.75)")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </a>

        <button onClick={onCartClick} aria-label="Cart" style={{
          position: "relative", background: "none", border: "none", cursor: "pointer",
          padding: 4, display: "flex",
          color: scrolled ? "var(--text-soft)" : "rgba(255,255,255,0.85)",
          transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text-soft)" : "rgba(255,255,255,0.85)")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {count > 0 && (
            <span style={{
              position: "absolute", top: -3, right: -3,
              background: "var(--accent)", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, fontSize: "0.575rem", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Inter', sans-serif",
            }}>{count > 9 ? "9+" : count}</span>
          )}
        </button>

        <button onClick={() => setOpen(!open)} className="nav-hamburger" aria-label="Menu"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none", flexDirection: "column", gap: 5 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", width: 22, height: 2,
              background: scrolled ? "var(--text)" : "#fff", borderRadius: 2,
              transition: "transform 0.25s, opacity 0.25s",
              transform: open ? (i === 0 ? "rotate(45deg) translateY(7px)" : i === 2 ? "rotate(-45deg) translateY(-7px)" : "none") : "none",
              opacity: open && i === 1 ? 0 : 1,
            }}/>
          ))}
        </button>
      </div>

      {open && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "rgba(250,248,244,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "1.5rem 2.5rem 2rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}>
          {[["Bundles", "#bundles"], ["Menu", "#menu"], ["Story", "#story"]].map(([l, href]) => (
            <a key={l} href={href} onClick={() => setOpen(false)} style={{
              fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 500,
              letterSpacing: "0.06em", color: "var(--text)", textDecoration: "none", textTransform: "uppercase",
            }}>{l}</a>
          ))}
          <button onClick={() => { setOpen(false); onCartClick(); }} style={{
            background: "var(--accent)", color: "#fff", borderRadius: 6, padding: "10px 20px",
            fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase", border: "none",
            cursor: "pointer", width: "fit-content", marginTop: "0.25rem",
          }}>View Cart {count > 0 ? `(${count})` : ""}</button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .nav-links { display: none !important; } .nav-hamburger { display: flex !important; } }
      `}</style>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden", background: "#1a0b04" }}>
      <video autoPlay muted loop playsInline style={{
        position: "absolute", inset: 0, width: "100%",
        height: "130%", objectFit: "cover", objectPosition: "center top",
        transform: "translateY(-10%)",
      }}>
        <source src="/hero.mp4" type="video/mp4"/>
      </video>

      {/* Solid bottom mask — covers any watermark */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1,
        height: "22%",
        background: "linear-gradient(to bottom, transparent 0%, #1a0b04 65%)",
      }}/>

      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, rgba(20,8,2,0.35) 0%, rgba(20,8,2,0.15) 35%, rgba(20,8,2,0.55) 78%, rgba(20,8,2,0.9) 92%, #1a0b04 100%)",
      }}/>

      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 1.5rem",
      }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 500,
            fontSize: "0.6875rem", letterSpacing: "0.28em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
            marginBottom: "1.25rem",
          }}>
          Lebanese Handcrafted Desserts
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Lobster', cursive",
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            fontWeight: 400,
            lineHeight: 1, color: "#fff",
            letterSpacing: "0", marginBottom: "1.75rem",
          }}>
          Cremia
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontWeight: 300, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "rgba(255,255,255,0.7)", letterSpacing: "0.02em",
            marginBottom: "2.75rem",
          }}>
          Every spoon hits a new layer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#menu" style={{
            background: "var(--accent)", color: "#fff",
            borderRadius: 6, padding: "13px 32px",
            fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
            fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", textDecoration: "none",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-h)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}>
            View Menu
          </a>
          <a href="#bundles" style={{
            background: "rgba(255,255,255,0.1)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 6, padding: "13px 28px",
            fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
            fontWeight: 500, letterSpacing: "0.06em",
            textTransform: "uppercase", textDecoration: "none",
            backdropFilter: "blur(8px)", transition: "border-color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}>
            View Bundles
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        style={{
          position: "absolute", bottom: "2.5rem", left: "50%",
          transform: "translateX(-50%)", zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.6rem",
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
        }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
          style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>↓</motion.div>
      </motion.div>
    </section>
  );
}

// ─── Intro ─────────────────────────────────────────────────────────────────────

function Intro() {
  return (
    <section style={{ background: "var(--bg)", padding: "6rem 2rem 5rem" }}>
      <AnimatedSection style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontWeight: 300, fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
          color: "var(--text)", lineHeight: 1.55, letterSpacing: "0.01em",
        }}>
          Cremia is crafted for those who believe a dessert should be an experience —
          from the very first glance to the very last spoon.
        </p>
        <div style={{ width: 40, height: 2, background: "var(--accent)", margin: "2rem auto 0", borderRadius: 1 }}/>
      </AnimatedSection>
    </section>
  );
}

// ─── Bundles ───────────────────────────────────────────────────────────────────

function BundlesSection({ onAddToCart }: { onAddToCart: (item: CartItem) => void }) {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [selections, setSelections] = useState<{ [flavorId: string]: number }>({});

  function openBundle(id: string) {
    if (activePlan === id) { setActivePlan(null); return; }
    setActivePlan(id);
    setSelections({});
  }

  const activePlanData = bundlePlans.find(p => p.id === activePlan) ?? null;

  // Each flavour's price inside a bundle is the bundle's reference price for its
  // tier divided by the number of boxes — so a full classic or full premium
  // selection always lands exactly on the bundle's listed price.
  function unitPrice(tier: "classic" | "premium", plan: BundlePlan): number {
    return (tier === "classic" ? plan.classicRef : plan.premiumRef) / plan.count;
  }

  function adjustQty(flavorId: string, delta: number) {
    if (!activePlanData) return;
    setSelections(prev => {
      const cur = prev[flavorId] ?? 0;
      const total = Object.values(prev).reduce((a, b) => a + b, 0);
      if (delta > 0 && total >= activePlanData.count) return prev;

      const next = { ...prev };
      const val = Math.max(0, cur + delta);
      if (val === 0) delete next[flavorId];
      else next[flavorId] = val;
      return next;
    });
  }

  function totalQty(): number {
    return Object.values(selections).reduce((a, b) => a + b, 0);
  }

  function totalPrice(): number {
    if (!activePlanData) return 0;
    return Object.entries(selections).reduce((sum, [id, qty]) => {
      const f = allFlavors.find(f => f.id === id);
      return sum + (f ? unitPrice(f.tier, activePlanData) * qty : 0);
    }, 0);
  }

  function handleAddToCart() {
    const plan = bundlePlans.find(p => p.id === activePlan);
    if (!plan || totalQty() !== plan.count) return;

    const detail = Object.entries(selections)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => `${allFlavors.find(f => f.id === id)!.name} ×${q}`)
      .join(", ");

    onAddToCart({
      id: `bundle-${activePlan}-${Date.now()}`,
      name: plan.name,
      detail,
      price: totalPrice(),
      qty: 1,
      image: null,
    });

    setActivePlan(null);
    setSelections({});
  }

  const activeBundle = bundlePlans.find(p => p.id === activePlan);

  return (
    <section id="bundles" style={{ background: "var(--bg)", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <AnimatedSection>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 500 }}>Bundle Sets</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            fontWeight: 400, lineHeight: 1,
            color: "var(--text)", marginBottom: "0.75rem",
          }}>Pick Your Occasion</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "0.9375rem", color: "var(--text-soft)", marginBottom: "3rem" }}>
            Choose your bundle size, then fill it with any flavours you love.
          </p>
        </AnimatedSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {bundlePlans.map((plan, i) => {
            const isActive = activePlan === plan.id;
            return (
              <AnimatedSection key={plan.id} delay={i * 0.1}>
                <div
                  onClick={() => openBundle(plan.id)}
                  style={{
                    background: plan.bg,
                    border: plan.border,
                    borderRadius: 14,
                    padding: "2.5rem 2rem",
                    cursor: "pointer",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    outline: isActive ? `2px solid ${plan.accent}` : "none",
                    outlineOffset: 2,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "1rem" }}>
                    {Array.from({ length: plan.count }).map((_, bi) => (
                      <div key={bi} style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: plan.id === "cozy" ? "rgba(196,98,45,0.1)" : "rgba(255,255,255,0.1)",
                        border: `1px solid ${plan.id === "cozy" ? "rgba(196,98,45,0.25)" : "rgba(255,255,255,0.18)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: "0.6rem", color: plan.accent, opacity: 0.7 }}>◆</span>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: plan.subtextColor, marginBottom: "0.4rem" }}>
                    {plan.count} boxes
                  </p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 500, lineHeight: 1, color: plan.textColor, marginBottom: "0.75rem" }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", fontWeight: 300, color: plan.subtextColor, marginBottom: "1.5rem" }}>
                    {plan.desc}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.5rem" }}>
                    {([["Classic flavours", `$${plan.classicRef}`], ["Premium flavours", `$${plan.premiumRef}`]] as [string, string][]).map(([label, price]) => (
                      <div key={label} style={{
                        display: "flex", justifyContent: "space-between",
                        padding: "0.5rem 0.75rem",
                        background: plan.id === "cozy" ? "rgba(196,98,45,0.07)" : "rgba(255,255,255,0.07)",
                        borderRadius: 6,
                      }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8125rem", color: plan.subtextColor }}>{label}</span>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.0625rem", fontWeight: 500, color: plan.accent }}>{price}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    width: "100%", padding: "11px 0", textAlign: "center",
                    background: isActive ? plan.accent : "transparent",
                    border: `1px solid ${plan.accent}`,
                    borderRadius: 6,
                    fontFamily: "'Inter', sans-serif", fontSize: "0.75rem",
                    fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                    color: isActive ? "#fff" : plan.accent,
                    transition: "all 0.2s",
                  }}>
                    {isActive ? "Customising ↓" : "Customise Bundle"}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Flavor picker */}
        <AnimatePresence>
          {activeBundle && (
            <motion.div
              key={activeBundle.id}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: "2rem",
                background: "var(--bg-warm)",
                borderRadius: 14, padding: "2.5rem 2rem",
                border: "1px solid var(--border)",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 500, color: "var(--text)", marginBottom: "0.25rem" }}>
                    Build your {activeBundle.name}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "var(--text-soft)", fontWeight: 300 }}>
                    Pick exactly {activeBundle.count} boxes — mix any flavours you like. Price auto-calculates.
                  </p>
                </div>
                <button
                  onClick={() => { setActivePlan(null); setSelections({}); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-soft)", fontSize: "1.25rem", padding: 4, lineHeight: 1 }}
                  aria-label="Close">✕</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
                {allFlavors.map(flavor => {
                  const qty = selections[flavor.id] ?? 0;
                  const price = unitPrice(flavor.tier, activeBundle);
                  const atLimit = totalQty() >= activeBundle.count && qty === 0;
                  return (
                    <div key={flavor.id} style={{
                      background: qty > 0 ? "rgba(196,98,45,0.06)" : "#fff",
                      border: qty > 0 ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                      borderRadius: 10, padding: "0.875rem 1rem",
                      display: "flex", flexDirection: "column", gap: "0.5rem",
                      opacity: atLimit ? 0.5 : 1,
                      transition: "border-color 0.2s, background 0.2s, opacity 0.2s",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: "var(--text)", lineHeight: 1.25, flex: 1 }}>{flavor.name}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginLeft: "0.5rem", flexShrink: 0 }}>${price.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                        <button
                          onClick={() => adjustQty(flavor.id, -1)}
                          disabled={qty === 0}
                          style={{
                            width: 28, height: 28, borderRadius: "50%",
                            border: "1px solid var(--border)", background: "#fff",
                            cursor: qty === 0 ? "default" : "pointer", fontSize: "1rem", color: "var(--text-mid)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            lineHeight: 1, opacity: qty === 0 ? 0.4 : 1,
                          }}>−</button>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)", minWidth: 20, textAlign: "center" }}>{qty}</span>
                        <button
                          onClick={() => adjustQty(flavor.id, 1)}
                          disabled={atLimit}
                          style={{
                            width: 28, height: 28, borderRadius: "50%",
                            border: "1px solid var(--border)", background: "#fff",
                            cursor: atLimit ? "default" : "pointer", fontSize: "1rem", color: "var(--text-mid)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            lineHeight: 1, opacity: atLimit ? 0.4 : 1,
                          }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: "0.75rem",
                    color: totalQty() === activeBundle.count ? "var(--accent)" : "var(--text-soft)",
                    fontWeight: totalQty() === activeBundle.count ? 600 : 400,
                    marginBottom: "0.2rem",
                  }}>
                    {totalQty()} / {activeBundle.count} boxes selected
                    {totalQty() === activeBundle.count ? " — ready!" : ""}
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.875rem", fontWeight: 500, color: "var(--text)" }}>
                    ${totalPrice().toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={totalQty() !== activeBundle.count}
                  style={{
                    background: totalQty() === activeBundle.count ? "var(--accent)" : "rgba(160,120,90,0.2)",
                    color: totalQty() === activeBundle.count ? "#fff" : "var(--text-soft)",
                    border: "none", borderRadius: 8,
                    padding: "13px 36px",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
                    fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                    cursor: totalQty() === activeBundle.count ? "pointer" : "default",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { if (totalQty() === activeBundle.count) e.currentTarget.style.background = "var(--accent-h)"; }}
                  onMouseLeave={e => { if (totalQty() === activeBundle.count) e.currentTarget.style.background = "var(--accent)"; }}>
                  Add to Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Menu ──────────────────────────────────────────────────────────────────────

function MenuSection({ onAddToCart }: { onAddToCart: (item: CartItem) => void }) {
  return (
    <section id="menu" style={{ background: "var(--bg-warm)", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <AnimatedSection>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 500 }}>The Menu</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            fontWeight: 400, lineHeight: 1,
            color: "var(--text)", marginBottom: "3rem",
          }}>
            Choose Your Layer
          </h2>
        </AnimatedSection>

        {menuCategories.map((cat, ci) => {
          const items = allFlavors.filter(f => f.category === cat.id);
          if (!items.length) return null;
          return (
            <div key={cat.id} style={{ marginBottom: ci < menuCategories.length - 1 ? "3rem" : 0 }}>
              <AnimatedSection delay={ci * 0.05}>
                <h3 style={{
                  fontFamily: "'Inter', sans-serif", fontSize: "0.75rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "var(--accent)", fontWeight: 600,
                  marginBottom: "0.75rem", paddingBottom: "0.75rem",
                  borderBottom: "1px solid var(--border)",
                }}>{cat.label}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1.5rem" }}>
                  {cat.notes.map((line, ni) => (
                    <p key={ni} style={{
                      fontFamily: "'Inter', sans-serif", fontWeight: 300,
                      fontSize: "0.8125rem", color: "var(--text-soft)",
                    }}>— {line}</p>
                  ))}
                </div>
              </AnimatedSection>

              <div>
                {items.map((item, i) => (
                  <AnimatedSection key={item.id} delay={i * 0.04}>
                    <div style={{
                      padding: "1.625rem 0",
                      borderBottom: "1px solid var(--border)",
                      display: "flex", gap: "1.25rem", alignItems: "flex-start",
                    }}>
                      {/* Image */}
                      <div style={{
                        width: 88, height: 88, flexShrink: 0,
                        borderRadius: 10,
                        background: "var(--cream)",
                        border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden",
                      }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                          : <span style={{ fontSize: "1.75rem", opacity: 0.18 }}>◻</span>
                        }
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1.1875rem", fontWeight: 500,
                          color: "var(--text)", lineHeight: 1.2,
                          marginBottom: "0.35rem",
                        }}>{item.name}</h3>
                        <p style={{
                          fontFamily: "'Inter', sans-serif", fontWeight: 300,
                          fontSize: "0.875rem", color: "var(--text-soft)",
                          lineHeight: 1.55, marginBottom: "0.875rem",
                        }}>{item.desc}</p>

                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          {/* Box */}
                          <button
                            onClick={() => onAddToCart({
                              id: `${item.id}-box-${Date.now()}`,
                              name: item.name, detail: "Solo Box",
                              price: item.boxPrice, qty: 1, image: item.image,
                            })}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: "0.4rem",
                              background: "var(--bg)", border: "1px solid var(--border)",
                              borderRadius: 6, padding: "7px 13px", cursor: "pointer",
                              transition: "border-color 0.2s, background 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(196,98,45,0.04)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg)"; }}>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.625rem", color: "var(--text-soft)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Box</span>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.0625rem", fontWeight: 500, color: "var(--text)" }}>${item.boxPrice}</span>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>+ Add</span>
                          </button>

                          {/* Tray */}
                          {item.trayPrice && (
                            <button
                              onClick={() => onAddToCart({
                                id: `${item.id}-tray-${Date.now()}`,
                                name: item.name, detail: "Sharing Tray",
                                price: item.trayPrice!, qty: 1, image: item.image,
                              })}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                background: "var(--bg)", border: "1px solid var(--border)",
                                borderRadius: 6, padding: "7px 13px", cursor: "pointer",
                                transition: "border-color 0.2s, background 0.2s",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(196,98,45,0.04)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg)"; }}>
                              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.625rem", color: "var(--text-soft)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Tray</span>
                              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.0625rem", fontWeight: 500, color: "var(--text)" }}>${item.trayPrice}</span>
                              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>+ Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Story ─────────────────────────────────────────────────────────────────────

function Story() {
  return (
    <section id="story" style={{ background: "var(--bg)", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <AnimatedSection>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 500 }}>Our Story</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)",
            fontWeight: 400, lineHeight: 1.1,
            color: "var(--text)", marginBottom: "2rem",
          }}>
            Made to Impress
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.8,
            marginBottom: "1.25rem",
          }}>
            Cremia was built around one conviction — a great dessert is both a luxury and an emotion. Every creation is made to order, using premium ingredients sourced for depth of flavour and finesse of texture.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.8,
          }}>
            Presented in our signature clear box, every layer is on display — because something this beautiful deserves to be seen before it is savoured.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Order ─────────────────────────────────────────────────────────────────────

function OrderSection({ cart, onUpdateQty, onRemove }: {
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const [form, setForm] = useState<OrderForm>({ name: "", phone: "", area: "", date: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    const lines = [
      "Hi, I'd like to place an order with Cremia:",
      "",
      ...cart.map(item => `• ${item.name} (${item.detail}) ×${item.qty} — $${(item.price * item.qty).toFixed(2)}`),
      "",
      `Total: $${calcTotal(cart).toFixed(2)}`,
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Delivery Area: ${form.area}`,
      `Preferred Date: ${form.date}`,
      ...(form.notes ? [`Notes: ${form.notes}`] : []),
    ].join("\n");

    window.open(`https://wa.me/96176000000?text=${encodeURIComponent(lines)}`, "_blank");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="order" style={{ background: "var(--text)", padding: "8rem 2rem", textAlign: "center" }}>
        <AnimatedSection style={{ maxWidth: 540, margin: "0 auto" }}>
          <div style={{ fontSize: "3rem", color: "var(--accent)", marginBottom: "1.5rem" }}>✓</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 400,
            color: "#fff", marginBottom: "1rem", lineHeight: 1,
          }}>Order received.</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
            We will confirm with you directly via WhatsApp.<br/>Thank you for choosing Cremia.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              marginTop: "2.5rem", background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)",
              borderRadius: 6, padding: "11px 28px",
              fontFamily: "'Inter', sans-serif", fontSize: "0.75rem",
              fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: "pointer",
            }}>
            Place Another Order
          </button>
        </AnimatedSection>
      </section>
    );
  }

  return (
    <section id="order" style={{ background: "var(--text)", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <AnimatedSection>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.75rem", fontWeight: 500 }}>Order</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(2.75rem, 5.5vw, 4rem)",
            fontWeight: 400, lineHeight: 1, color: "#fff", marginBottom: "3rem",
          }}>Ready to indulge?</h2>
        </AnimatedSection>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }} className="order-grid">
          {/* Cart */}
          <AnimatedSection delay={0.1}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem" }}>
              Your Order
            </p>

            {cart.length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "2.5rem", textAlign: "center",
              }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.25rem", color: "rgba(255,255,255,0.3)" }}>
                  Your cart is empty
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.2)", marginTop: "0.5rem", fontWeight: 300 }}>
                  Add items from the Menu or Bundles above.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {cart.map(item => (
                  <div key={item.id} style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, padding: "1rem 1.125rem",
                    display: "flex", gap: "0.875rem", alignItems: "flex-start",
                  }}>
                    <div style={{
                      width: 52, height: 52, flexShrink: 0, borderRadius: 7,
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                        : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.25rem" }}>◻</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: "#fff", marginBottom: "0.15rem", lineHeight: 1.2 }}>{item.name}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontWeight: 300, marginBottom: "0.5rem", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.detail}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button onClick={() => onUpdateQty(item.id, -1)} style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>−</button>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#fff", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.id, 1)} style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.125rem", fontWeight: 500, color: "#fff" }}>${(item.price * item.qty).toFixed(2)}</p>
                      <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", marginTop: "0.25rem", padding: 0 }}>remove</button>
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Total</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500, color: "#fff" }}>${calcTotal(cart).toFixed(2)}</span>
                </div>
              </div>
            )}
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection delay={0.15}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem" }}>
                Your Details
              </p>

              {([
                { key: "name"  as const, label: "Your Name",      type: "text", placeholder: "Full name"   },
                { key: "phone" as const, label: "Phone Number",   type: "tel",  placeholder: "+961 ..."     },
                { key: "date"  as const, label: "Preferred Date", type: "date", placeholder: ""             },
              ]).map(({ key, label, type, placeholder }) => (
                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>{label}</label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 7, padding: "11px 14px",
                      fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem",
                      color: "#fff", outline: "none", colorScheme: "dark",
                    }}
                  />
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>Delivery Area</label>
                <select
                  required
                  value={form.area}
                  onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                  style={{
                    background: "rgba(30,10,2,0.95)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 7, padding: "11px 14px",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem",
                    color: form.area ? "#fff" : "rgba(255,255,255,0.3)",
                    outline: "none", cursor: "pointer", colorScheme: "dark",
                  }}>
                  <option value="" disabled style={{ color: "rgba(255,255,255,0.3)" }}>Select your area</option>
                  {deliveryAreas.map(a => <option key={a} value={a} style={{ background: "#1a0b04", color: "#fff" }}>{a}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>Special Requests / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Allergies, gift message, timing…"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 7, padding: "11px 14px",
                    fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem",
                    color: "#fff", outline: "none", resize: "vertical", colorScheme: "dark",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "var(--accent)", color: "#fff",
                  border: "none", borderRadius: 8,
                  padding: "14px 0", width: "100%",
                  fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
                  fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                  cursor: "pointer", transition: "background 0.2s", marginTop: "0.5rem",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-h)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}>
                Place Order
              </button>

              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.6 }}>
                Your order is received securely · We will confirm with you directly
              </p>
            </form>
          </AnimatedSection>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) { .order-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      background: "var(--bg)", borderTop: "1px solid var(--border)",
      padding: "3rem 2rem",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", textAlign: "center",
    }}>
      <a href="#" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "'Lobster', cursive",
          fontSize: "1.625rem", fontWeight: 400, color: "var(--text)", letterSpacing: "0",
        }}>Cremia</span>
      </a>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.9375rem", color: "var(--text-soft)" }}>
        Every spoon hits a new layer.
      </p>
      <a href="https://instagram.com/Cremia_lb" target="_blank" rel="noopener noreferrer"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--accent)", textDecoration: "none", textTransform: "uppercase", fontWeight: 500 }}>
        @Cremia_lb
      </a>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "var(--text-soft)", letterSpacing: "0.04em" }}>
        © {new Date().getFullYear()} Cremia. Lebanon.
      </p>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: CartItem) {
    setCart(prev => {
      if (item.id.startsWith("bundle-")) return [...prev, item];
      const existing = prev.find(c => c.name === item.name && c.detail === item.detail);
      if (existing) return prev.map(c => c.id === existing.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, item];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev =>
      prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
          .filter(item => item.qty > 0)
    );
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function scrollToOrder() {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Navbar cart={cart} onCartClick={scrollToOrder} />
      <main>
        <Hero />
        <MarqueeBar />
        <Intro />
        <BundlesSection onAddToCart={addToCart} />
        <MenuSection onAddToCart={addToCart} />
        <Story />
        <OrderSection cart={cart} onUpdateQty={updateQty} onRemove={removeItem} />
      </main>
      <Footer />
    </>
  );
}
