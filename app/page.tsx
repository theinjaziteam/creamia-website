"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MarqueeBar from "../components/MarqueeBar";
import AnimatedSection from "../components/AnimatedSection";

// Three.js scene — dynamic import (no SSR)
const LotusScene3D = dynamic(() => import("../components/LotusScene3D"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "transparent" }} />,
});

// ─── Colour tokens ──────────────────────────────────────────────────────────
const C = {
  canvas:   "#1A0B04",
  mid:      "#2D1506",
  surface:  "#3D2010",
  lotus:    "#C4622D",
  lotusL:   "#E8835A",
  lotusD:   "#8B3E10",
  gold:     "#C9A87C",
  cream:    "#EDEADC",
  creamW:   "#FBF5EC",
  taupe:    "#C8C0B0",
  muted:    "#8B7B68",
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface Product {
  name: string;
  desc: string;
  trayPrice?: string;
  boxPrice?: string;
  accent: string;
  bg: string;
  text: string;
  tag?: string;
}

interface BoxSet {
  name: string;
  subtitle: string;
  count: number;
  priceBavarian: string;
  pricePremium: string;
  tagline: string;
  bg: string;
  accent: string;
  text: string;
}

// ─── Menu Data ──────────────────────────────────────────────────────────────
const bavarianProducts: Product[] = [
  {
    name: "Strawberry Mousse Cake",
    desc: "Silky strawberry mousse over a buttery biscuit base — light, fruity, irresistible.",
    trayPrice: "$10", boxPrice: "$4",
    accent: "#E07060", bg: "#3D1818", text: C.creamW,
  },
  {
    name: "Mango Bavarian Cream",
    desc: "Tropical mango custard with a vanilla finish — sunshine in every spoon.",
    trayPrice: "$10", boxPrice: "$4",
    accent: "#D4A020", bg: "#3D2C08", text: C.creamW,
  },
  {
    name: "Banana Bavarian Cream",
    desc: "Velvet banana cream with caramelised biscuit crumble — pure nostalgia.",
    trayPrice: "$10", boxPrice: "$4",
    accent: "#C4B040", bg: "#2D2808", text: C.creamW,
  },
  {
    name: "Halawa Bavarian Cream",
    desc: "Lebanese halawa whipped into silky bavarian cream — a sweet heritage moment.",
    trayPrice: "$10", boxPrice: "$4",
    accent: C.gold, bg: C.surface, text: C.creamW,
  },
  {
    name: "Halawet el Riz",
    desc: "Traditional Levantine rice cream, lightly sweetened with rose water.",
    boxPrice: "$4",
    accent: "#C8A0C0", bg: "#2C1830", text: C.creamW,
  },
  {
    name: "Moufataka",
    desc: "A beloved Lebanese classic — rice pudding layered with caramelised sugar and nuts.",
    boxPrice: "$4",
    accent: C.gold, bg: "#2D2010", text: C.creamW,
  },
];

const premiumProducts: Product[] = [
  {
    name: "Tiramisu Classic",
    desc: "Espresso-soaked ladyfingers, cloud-like mascarpone, a veil of dark cocoa.",
    trayPrice: "$13", boxPrice: "$6",
    accent: "#C4871F", bg: "#100806", text: C.creamW,
    tag: "BESTSELLER",
  },
  {
    name: "Tiramisu Brownie",
    desc: "Fudgy brownie base meets tiramisu cream — the best of both worlds.",
    trayPrice: "$14", boxPrice: "$7",
    accent: C.lotusL, bg: "#0D0402", text: C.creamW,
  },
  {
    name: "Lotus Cheesecake",
    desc: "Caramelised Biscoff base, velvety cream cheese, a drizzle of liquid gold.",
    trayPrice: "$13", boxPrice: "$6",
    accent: C.lotus, bg: "#3D1E08", text: C.creamW,
    tag: "SIGNATURE",
  },
  {
    name: "Oreo Cheesecake",
    desc: "Crushed Oreo crust, thick cream cheese cloud, chocolate crumble crown.",
    trayPrice: "$13", boxPrice: "$6",
    accent: "#888", bg: "#0A0A0A", text: "#FFFFFF",
  },
  {
    name: "Blueberry Cheesecake",
    desc: "Tart blueberry compote swirled into creamy cheesecake — bold and beautiful.",
    trayPrice: "$13", boxPrice: "$6",
    accent: "#8878E0", bg: "#1A103A", text: "#FFFFFF",
  },
  {
    name: "Raspberry Cheesecake",
    desc: "Tangy raspberry coulis ribboned through silky cheesecake — sharp, sweet, stunning.",
    trayPrice: "$13", boxPrice: "$6",
    accent: "#E06070", bg: "#280818", text: "#FFFFFF",
  },
  {
    name: "Dream Cake",
    desc: "Our signature creation — layers of fantasy. Ask us what's inside today.",
    trayPrice: "Ask", boxPrice: "Ask",
    accent: "#FFD700", bg: "#1A0B24", text: "#FFFFFF",
    tag: "MYSTERY",
  },
];

const boxSets: BoxSet[] = [
  {
    name: "Cozy Box",
    subtitle: "4 Boxes",
    count: 4,
    priceBavarian: "$14",
    pricePremium: "$20",
    tagline: "Perfect for two — or just you.",
    bg: C.surface,
    accent: C.gold,
    text: C.creamW,
  },
  {
    name: "Gathering Box",
    subtitle: "6 Boxes",
    count: 6,
    priceBavarian: "$21",
    pricePremium: "$27",
    tagline: "Bring joy to every table.",
    bg: C.lotus,
    accent: C.creamW,
    text: "#FFFFFF",
  },
  {
    name: "Celebration Box",
    subtitle: "12 Boxes",
    count: 12,
    priceBavarian: "$40",
    pricePremium: "$50",
    tagline: "For the moments that deserve more.",
    bg: C.canvas,
    accent: C.gold,
    text: C.creamW,
  },
];

// ─── CSS Milk Splash (no Three.js needed — pure CSS/SVG) ────────────────────
function MilkSplashCSS() {
  const drops = [
    { x: 50, delay: 0, size: 12, height: 80 },
    { x: 35, delay: 0.15, size: 9, height: 65 },
    { x: 65, delay: 0.25, size: 11, height: 72 },
    { x: 28, delay: 0.4, size: 7, height: 55 },
    { x: 72, delay: 0.3, size: 8, height: 60 },
    { x: 42, delay: 0.55, size: 6, height: 50 },
    { x: 58, delay: 0.45, size: 10, height: 68 },
    { x: 20, delay: 0.6, size: 5, height: 45 },
    { x: 80, delay: 0.5, size: 6, height: 48 },
  ];

  const rings = [1, 1.6, 2.2];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "280px",
        height: "180px",
        pointerEvents: "none",
      }}
    >
      {/* Splash rings */}
      {rings.map((scale, i) => (
        <div
          key={i}
          className="milk-ring"
          style={{
            width: "80px",
            height: "30px",
            top: "65%",
            left: "50%",
            animation: `milkRing ${1.8 + i * 0.4}s ease-out ${i * 0.25}s infinite`,
            borderColor: `rgba(255,255,255,${0.6 - i * 0.15})`,
          }}
        />
      ))}

      {/* Pool ellipse */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "28px",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Drops */}
      {drops.map((d, i) => (
        <div
          key={i}
          className="milk-drop"
          style={{
            bottom: "22%",
            left: `${d.x}%`,
            width: `${d.size}px`,
            height: `${d.size * 1.35}px`,
            animation: `milkDrop ${1.4 + Math.random() * 0.4}s ease-out ${d.delay}s infinite`,
            transformOrigin: "bottom center",
          }}
        />
      ))}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
        background: scrolled
          ? "rgba(26,11,4,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(196,98,45,0.18)" : "1px solid transparent",
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      {/* ── Brand Logo ── */}
      <a
        href="#"
        style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: "0.2rem" }}
      >
        <span
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "2rem",
            fontWeight: 700,
            color: C.creamW,
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          Cremi
        </span>
        <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: C.lotus, lineHeight: 1 }}>~</span>
      </a>

      {/* ── Desktop links (Space Mono ALL-CAPS — The Verge signature) ── */}
      <div
        className="md-flex"
        style={{ alignItems: "center", gap: "2.75rem" }}
      >
        {["Menu", "Boxes", "Story", "Order"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.taupe,
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.cream)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.taupe)}
          >
            {l}
          </a>
        ))}
      </div>

      {/* ── Right side ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <a
          href="https://www.instagram.com/Cremi_lb"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Cremi Instagram"
          style={{ color: C.taupe, transition: "color 150ms ease", display: "flex" }}
          onMouseEnter={(e) => ((e.target as SVGElement).style.color = C.cream)}
          onMouseLeave={(e) => ((e.target as SVGElement).style.color = C.taupe)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <a href="#order" className="btn-primary hide-mobile" style={{ padding: "10px 22px" }}>
          Order Now
        </a>

        {/* hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="hide-desktop"
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "4px" }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: "22px", height: "2px",
                background: C.cream,
                display: "block",
                borderRadius: "2px",
                transition: "transform 0.25s, opacity 0.25s",
                transform: open
                  ? i === 0 ? "rotate(45deg) translateY(7px)"
                  : i === 2 ? "rotate(-45deg) translateY(-7px)" : "none"
                  : "none",
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "68px", left: 0, right: 0,
            background: "rgba(26,11,4,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(196,98,45,0.2)",
            padding: "1.75rem 2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {["Menu", "Boxes", "Story", "Order"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.875rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.cream,
                textDecoration: "none",
              }}
            >
              {l}
            </a>
          ))}
          <a href="#order" className="btn-primary" onClick={() => setOpen(false)} style={{ width: "fit-content", marginTop: "0.5rem" }}>
            Order Now
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: C.canvas,
      }}
    >
      {/* ── Background Video ── */}
      {/* clip-path crops bottom ~9% to remove the Gemini watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "115%",          /* scale up so crop doesn't shrink viewport */
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            transform: "translateY(-4%)",  /* shift up, Gemini logo goes off-screen */
          }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Dark overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(to bottom, rgba(26,11,4,0.72) 0%, rgba(26,11,4,0.42) 35%, rgba(26,11,4,0.78) 82%, #1A0B04 100%)",
        }}
      />

      {/* ── 3D Lotus Biscuit — floats in the centre foreground ── */}
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "min(560px, 50vw)",
          height: "min(420px, 40vw)",
          zIndex: 5,
          pointerEvents: "none",
        }}
        className="hide-mobile"
      >
        <Suspense fallback={null}>
          <LotusScene3D />
        </Suspense>
        {/* Milk splash behind biscuit */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <MilkSplashCSS />
        </div>
      </div>

      {/* ── Hero Copy ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 2.5rem",
          paddingTop: "68px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        {/* Kicker — Space Mono ALL CAPS (The Verge signature) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <span
            className="type-kicker"
            style={{
              color: C.lotus,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                width: "28px",
                height: "1px",
                background: C.lotus,
                display: "inline-block",
              }}
            />
            Lebanese Desserts · Beirut
          </span>
        </motion.div>

        {/* Display — Bebas Neue massive (Manuka approach) */}
        <h1
          style={{
            maxWidth: "700px",
            marginBottom: "0",
          }}
        >
          {[
            { text: "EVERY",     size: "clamp(5rem, 11vw, 10rem)", color: C.cream,  style: "normal" },
            { text: "SPOON",     size: "clamp(5rem, 11vw, 10rem)", color: C.cream,  style: "normal" },
            { text: "HITS A",    size: "clamp(3.8rem, 8vw, 7.5rem)", color: C.taupe, style: "normal" },
            { text: "NEW LAYER", size: "clamp(4.5rem, 9.5vw, 8.5rem)", color: C.lotus, style: "italic" },
          ].map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "block",
                fontFamily: line.style === "italic"
                  ? "'Playfair Display', Georgia, serif"
                  : "'Bebas Neue', Impact, sans-serif",
                fontSize: line.size,
                fontWeight: line.style === "italic" ? 400 : 400,
                fontStyle: line.style === "italic" ? "italic" : "normal",
                lineHeight: 0.9,
                color: line.color,
                letterSpacing: line.style === "italic" ? "-0.01em" : "0.04em",
                marginBottom: "0.12em",
              }}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>

        {/* Sub-deck — DM Sans whisper style */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "1.0625rem",
            color: C.taupe,
            lineHeight: 1.75,
            maxWidth: "400px",
            marginTop: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          Handcrafted tiramisu, cheesecakes & Bavarian creams in beautiful clear boxes. Made fresh in Lebanon.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}
        >
          <a href="#menu" className="btn-primary" style={{ fontSize: "0.75rem", padding: "14px 32px" }}>
            Order Now
          </a>
          <a
            href="https://www.instagram.com/Cremi_lb"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ fontSize: "0.75rem", padding: "14px 28px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            @Cremi_lb
          </a>
        </motion.div>

        {/* Stats strip — 1px border top (The Verge hairline approach) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            display: "flex",
            gap: "3rem",
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: `1px solid rgba(200,192,176,0.12)`,
            flexWrap: "wrap",
          }}
        >
          {[["13+", "Flavours"], ["3", "Box Sizes"], ["LB", "Lebanon"]].map(([val, label]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.25rem",
                  color: C.lotus,
                  lineHeight: 0.9,
                  letterSpacing: "0.05em",
                  marginBottom: "0.3rem",
                }}
              >
                {val}
              </div>
              <div className="type-kicker" style={{ color: C.muted }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          zIndex: 10,
        }}
      >
        <span className="type-kicker" style={{ color: "rgba(200,192,176,0.25)", fontSize: "0.6rem" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ color: "rgba(196,98,45,0.4)", fontSize: "1rem" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Lotus Feature Section (3D Biscuit spotlight) ────────────────────────────
function LotusFeature() {
  return (
    <section
      style={{
        background: "#0D0502",
        padding: "7rem 2.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(196,98,45,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
        className="hero-split"
      >
        {/* Left — 3D biscuit + milk splash */}
        <AnimatedSection delay={0}>
          <div
            style={{
              position: "relative",
              height: "480px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Glow behind biscuit */}
            <div
              style={{
                position: "absolute",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(196,98,45,0.25) 0%, transparent 70%)",
                filter: "blur(40px)",
                animation: "pulse 3s ease-in-out infinite",
              }}
            />
            {/* Three.js canvas */}
            <div style={{ width: "100%", height: "380px", position: "relative", zIndex: 2 }}>
              <Suspense fallback={null}>
                <LotusScene3D />
              </Suspense>
            </div>
            {/* Milk splash decoration */}
            <MilkSplashCSS />

            {/* "From $6" badge */}
            <div
              style={{
                position: "absolute",
                bottom: "60px",
                right: "10%",
                background: C.lotus,
                borderRadius: "20px",
                padding: "0.75rem 1.25rem",
                zIndex: 10,
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.5rem",
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "0.06em",
                }}
              >
                FROM $6
              </div>
              <div className="type-kicker" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.55rem", marginTop: "2px" }}>
                Per box
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Right — copy */}
        <div>
          <AnimatedSection delay={0.1}>
            <span className="type-kicker" style={{ color: C.lotus }}>
              ◆ Signature Flavour
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4rem, 7vw, 7rem)",
                lineHeight: 0.88,
                letterSpacing: "0.03em",
                color: C.cream,
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              LOTUS
            </h2>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                color: C.gold,
                marginBottom: "2rem",
              }}
            >
              Cheesecake
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "1.0625rem",
                color: C.taupe,
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              Caramelised Biscoff base crushed to perfection. Velvety cream cheese filling — rich, tangy, cloud-like. Finished with a drizzle of liquid Lotus gold. Every spoon hits a new layer.
            </p>

            {/* Layer breakdown — The Verge StoryStream rail style */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                borderLeft: `1px solid rgba(196,98,45,0.3)`,
                paddingLeft: "1.25rem",
                marginBottom: "2rem",
              }}
            >
              {[
                ["LAYER 01", "Lotus Biscoff crumble base"],
                ["LAYER 02", "Velvety cream cheese filling"],
                ["LAYER 03", "Liquid Lotus drizzle crown"],
              ].map(([label, desc]) => (
                <div key={label} style={{ padding: "0.9rem 0", borderBottom: `1px solid rgba(200,192,176,0.06)` }}>
                  <div className="type-kicker" style={{ color: C.lotus, fontSize: "0.6rem", marginBottom: "0.25rem" }}>
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9375rem",
                      color: C.cream,
                      fontWeight: 400,
                    }}
                  >
                    {desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <a href="#menu" className="btn-primary">Order Lotus</a>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  paddingLeft: "0.5rem",
                }}
              >
                {[["$6", "Box"], ["$13", "Tray"]].map(([price, type]) => (
                  <div key={type}>
                    <div
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.5rem",
                        color: C.gold,
                        lineHeight: 1,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {price}
                    </div>
                    <div className="type-kicker" style={{ color: C.muted, fontSize: "0.55rem" }}>
                      {type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className="card-hover"
      style={{
        background: product.bg,
        minHeight: "320px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tag chip (Space Mono — The Verge label pill) */}
      {product.tag && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: product.accent,
            borderRadius: "20px",
            padding: "4px 12px",
          }}
        >
          <span className="type-kicker" style={{ fontSize: "0.6rem", color: "#fff" }}>
            {product.tag}
          </span>
        </div>
      )}

      {/* Abstract layer visual */}
      <div style={{ height: "140px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {/* Gradient layers suggesting dessert cross-section */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${product.accent}40 0%, transparent 60%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: `${product.accent}30`,
            backdropFilter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: 0,
            right: 0,
            height: "18%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        {/* Price badge */}
        {product.boxPrice && product.boxPrice !== "Ask" && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              background: "rgba(0,0,0,0.45)",
              border: `1px solid ${product.accent}50`,
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              padding: "5px 12px",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                color: product.accent,
                letterSpacing: "0.06em",
              }}
            >
              FROM {product.boxPrice}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "1.25rem 1.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            color: product.text,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "0.875rem",
            color: product.text,
            opacity: 0.65,
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {product.desc}
        </p>

        {/* Pricing row — hairline border (The Verge flat depth) */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "0.5rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            flexWrap: "wrap",
          }}
        >
          {product.trayPrice && product.trayPrice !== "Ask" && (
            <div>
              <span className="type-kicker" style={{ color: product.text, opacity: 0.45, fontSize: "0.58rem" }}>
                Tray{" "}
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  color: product.accent,
                  letterSpacing: "0.05em",
                }}
              >
                {product.trayPrice}
              </span>
            </div>
          )}
          {product.boxPrice && product.boxPrice !== "Ask" && (
            <div>
              <span className="type-kicker" style={{ color: product.text, opacity: 0.45, fontSize: "0.58rem" }}>
                Box{" "}
              </span>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  color: product.accent,
                  letterSpacing: "0.05em",
                }}
              >
                {product.boxPrice}
              </span>
            </div>
          )}
          {product.boxPrice === "Ask" && (
            <span className="type-kicker" style={{ color: product.accent, fontSize: "0.65rem" }}>
              Price on Request
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Menu Section ────────────────────────────────────────────────────────────
function MenuSection() {
  const [tab, setTab] = useState<"premium" | "bavarian">("premium");

  return (
    <section
      id="menu"
      style={{
        background: C.mid,
        padding: "8rem 2.5rem",
        position: "relative",
      }}
    >
      {/* Hairline top (The Verge section separator) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "2.5rem",
          right: "2.5rem",
          height: "1px",
          background: `rgba(200,192,176,0.08)`,
        }}
      />

      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        {/* Header */}
        <AnimatedSection>
          <div style={{ marginBottom: "3.5rem" }}>
            <span className="type-kicker" style={{ color: C.lotus }}>
              ◆ The Menu
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
                lineHeight: 0.88,
                color: C.cream,
                letterSpacing: "0.03em",
                marginTop: "0.75rem",
              }}
            >
              CHOOSE YOUR LAYER
            </h2>
          </div>
        </AnimatedSection>

        {/* Tab switcher — pill pair (20px radius — The Verge card pill) */}
        <AnimatedSection delay={0.1}>
          <div style={{ marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-flex",
                background: C.canvas,
                borderRadius: "20px",
                padding: "5px",
                border: `1px solid rgba(200,192,176,0.08)`,
                gap: "4px",
              }}
            >
              {([
                { id: "premium", label: "Tiramisu & Cheesecakes" },
                { id: "bavarian", label: "Bavarian & Mousse" },
              ] as { id: "premium" | "bavarian"; label: string }[]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    borderRadius: "16px",
                    padding: "10px 22px",
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 400,
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    background: tab === t.id ? C.lotus : "transparent",
                    color: tab === t.id ? "#fff" : C.muted,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Grid */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {(tab === "premium" ? premiumProducts : bavarianProducts).map((p, i) => (
            <AnimatedSection key={p.name} delay={i * 0.06}>
              <ProductCard product={p} />
            </AnimatedSection>
          ))}
        </motion.div>

        {/* Note — hairline border container (The Verge card style) */}
        <AnimatedSection delay={0.3}>
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              padding: "1.5rem 2rem",
              borderRadius: "20px",
              border: `1px solid rgba(200,192,176,0.08)`,
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "0.9375rem",
                color: C.muted,
              }}
            >
              All items available as{" "}
              <strong style={{ color: C.cream, fontWeight: 600 }}>Medium Tray</strong>{" "}
              or{" "}
              <strong style={{ color: C.cream, fontWeight: 600 }}>Small Individual Box</strong>.
              Custom orders — DM us on Instagram.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Box Card ────────────────────────────────────────────────────────────────
function BoxCard({ box }: { box: BoxSet }) {
  return (
    <div
      style={{
        background: box.bg,
        borderRadius: "24px",
        padding: "2.5rem 2rem 2rem",
        border: `1px solid rgba(255,255,255,0.06)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        transition: "transform 0.3s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
        (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(196,98,45,0.4)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* Stacked box visual */}
      <div style={{ height: "90px", position: "relative", marginBottom: "1.75rem" }}>
        {[...Array(Math.min(box.count, 4))].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${6 + i * 8}px`,
              bottom: `${i * 10}px`,
              width: `${130 - i * 10}px`,
              height: "36px",
              borderRadius: "8px",
              background: i % 2 === 0
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          />
        ))}
      </div>

      {/* Subtitle kicker */}
      <span className="type-kicker" style={{ color: box.accent, fontSize: "0.65rem", marginBottom: "0.4rem" }}>
        {box.subtitle}
      </span>

      {/* Name */}
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "2.25rem",
          color: box.text,
          letterSpacing: "0.04em",
          lineHeight: 0.95,
          marginBottom: "0.5rem",
        }}
      >
        {box.name}
      </h3>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontSize: "0.9375rem",
          color: box.text,
          opacity: 0.65,
          marginBottom: "1.75rem",
        }}
      >
        {box.tagline}
      </p>

      {/* Price rows — hairline border cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem" }}>
        {[
          { label: "Bavarian / Mousse", price: box.priceBavarian },
          { label: "Tiramisu / Cheesecake", price: box.pricePremium },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.65rem 1rem",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "0.875rem",
                color: box.text,
                opacity: 0.75,
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.35rem",
                color: box.accent,
                letterSpacing: "0.05em",
              }}
            >
              {row.price}
            </span>
          </div>
        ))}
      </div>

      <a
        href="https://www.instagram.com/Cremi_lb"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{
          background: box.accent === C.creamW ? C.lotus : box.accent,
          color: "#fff",
          justifyContent: "center",
          borderRadius: "20px",
          padding: "12px 0",
          width: "100%",
          textAlign: "center",
        }}
      >
        Order This Box
      </a>
    </div>
  );
}

// ─── Box Collections ──────────────────────────────────────────────────────────
function BoxCollections() {
  return (
    <section
      id="boxes"
      style={{
        background: C.canvas,
        padding: "8rem 2.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(196,98,45,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "2.5rem",
          right: "2.5rem",
          height: "1px",
          background: "rgba(200,192,176,0.07)",
        }}
      />

      <div style={{ maxWidth: "1300px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <div style={{ marginBottom: "3.5rem" }}>
            <span className="type-kicker" style={{ color: C.lotus }}>
              ◆ Box Collections
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
                lineHeight: 0.88,
                color: C.cream,
                letterSpacing: "0.03em",
                marginTop: "0.75rem",
              }}
            >
              PICK YOUR OCCASION
            </h2>
          </div>
        </AnimatedSection>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {boxSets.map((box, i) => (
            <AnimatedSection key={box.name} delay={i * 0.1}>
              <BoxCard box={box} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Our Story ────────────────────────────────────────────────────────────────
function OurStory() {
  return (
    <section
      id="story"
      style={{
        background: C.mid,
        padding: "8rem 2.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "2.5rem",
          right: "2.5rem",
          height: "1px",
          background: "rgba(200,192,176,0.07)",
        }}
      />

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}
        className="story-split"
      >
        {/* Left — quote/visual */}
        <AnimatedSection delay={0}>
          <div style={{ position: "relative" }}>
            {/* Big pull-quote — The Verge editorial serif moment */}
            <div
              style={{
                borderLeft: `3px solid ${C.lotus}`,
                paddingLeft: "2rem",
                marginBottom: "3rem",
              }}
            >
              <p
                className="type-editorial"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
                  color: C.cream,
                  lineHeight: 1.45,
                  marginBottom: "1rem",
                }}
              >
                "Born in a home kitchen in Lebanon, from a simple obsession: desserts that tell a story in every bite."
              </p>
              <span className="type-kicker" style={{ color: C.lotus, fontSize: "0.62rem" }}>
                — Cremi~, Est. 2023
              </span>
            </div>

            {/* Colour-block tile (The Verge story-tile approach) */}
            <div
              style={{
                background: C.lotus,
                borderRadius: "24px",
                padding: "2rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0",
              }}
            >
              {[
                { num: "10+", label: "Flavours" },
                { num: "3",   label: "Box Sizes" },
                { num: "100%", label: "Fresh" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center", padding: "0.5rem" }}>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "2.5rem",
                      color: "#fff",
                      lineHeight: 0.9,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.num}
                  </div>
                  <div className="type-kicker" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.58rem", marginTop: "4px" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Right — text */}
        <div>
          <AnimatedSection delay={0.1}>
            <span className="type-kicker" style={{ color: C.lotus }}>
              ◆ Our Story
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 5vw, 5rem)",
                lineHeight: 0.9,
                color: C.cream,
                letterSpacing: "0.03em",
                marginTop: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              BORN FROM A LOVE OF LAYERS
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "1.0625rem",
                color: C.taupe,
                lineHeight: 1.8,
                marginBottom: "1.25rem",
              }}
            >
              Cremi~ was born in a home kitchen in Lebanon, from a simple obsession: desserts that tell a story in every bite. Each box holds carefully crafted layers — biscuit, cream, flavour, repeat.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "1.0625rem",
                color: C.taupe,
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              We believe indulgence deserves presentation. That&apos;s why every Cremi creation arrives in its signature clear box — so you see the beauty before you taste it.
            </p>

            {/* Values — StoryStream rail style */}
            <div
              style={{
                borderLeft: `1px solid rgba(196,98,45,0.25)`,
                paddingLeft: "1.25rem",
              }}
            >
              {[
                ["Made Fresh", "Every order crafted on demand"],
                ["Beautifully Presented", "See the layers before you taste them"],
                ["Lebanese Heart", "Local ingredients, global flavours"],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  style={{
                    padding: "0.875rem 0",
                    borderBottom: "1px solid rgba(200,192,176,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: C.cream,
                      marginBottom: "0.15rem",
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.875rem",
                      color: C.muted,
                    }}
                  >
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── Order CTA ───────────────────────────────────────────────────────────────
function OrderCTA() {
  return (
    <section
      id="order"
      style={{
        background: C.lotus,
        padding: "8rem 2.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatedSection>
          <span className="type-kicker" style={{ color: "rgba(255,255,255,0.7)" }}>
            ◆ Ready to Order?
          </span>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(4rem, 9vw, 8rem)",
              lineHeight: 0.88,
              color: "#fff",
              letterSpacing: "0.03em",
              margin: "1rem 0 1.5rem",
            }}
          >
            READY TO INDULGE?
          </h2>
          <p
            className="type-editorial"
            style={{
              fontSize: "1.1875rem",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.65,
              maxWidth: "520px",
              margin: "0 auto 3rem",
            }}
          >
            Every Cremi box is made fresh on order. Send us a message on Instagram or WhatsApp and we&apos;ll take care of the rest.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://www.instagram.com/Cremi_lb"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#fff",
                color: C.lotus,
                borderRadius: "24px",
                padding: "14px 32px",
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "opacity 180ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              Order on Instagram
            </a>

            <a
              href="https://wa.me/96176000000?text=Hi%2C%20I%27d%20like%20to%20order%20from%20Cremi~"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.45)",
                borderRadius: "40px",
                padding: "14px 32px",
                fontFamily: "'Space Mono', monospace",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "border-color 150ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.85)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.45)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.9-5.7A8.5 8.5 0 1 1 7.7 17l-4.7 4z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: C.canvas,
        borderTop: `1px solid rgba(200,192,176,0.07)`,
        padding: "4rem 2.5rem 3rem",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.75rem",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "2.5rem",
              fontWeight: 700,
              color: C.creamW,
              lineHeight: 1,
            }}
          >
            Cremi
          </span>
          <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2.5rem", color: C.lotus }}>~</span>
        </a>

        {/* Editorial serif tagline */}
        <p className="type-editorial" style={{ fontSize: "1rem", color: C.muted }}>
          Every Spoon Hits a New Layer
        </p>

        {/* Social */}
        <a
          href="https://www.instagram.com/Cremi_lb"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            transition: "color 150ms ease",
            color: C.lotus,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span className="type-kicker" style={{ fontSize: "0.65rem", color: C.lotus }}>
            @Cremi_lb
          </span>
        </a>

        <div style={{ width: "32px", height: "1px", background: "rgba(200,192,176,0.12)" }} />

        <p className="type-kicker" style={{ fontSize: "0.6rem", color: C.muted }}>
          &copy; {new Date().getFullYear()} Cremi~. All rights reserved. Lebanon.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MarqueeBar />
        <LotusFeature />
        <MenuSection />
        <BoxCollections />
        <OurStory />
        <OrderCTA />
      </main>
      <Footer />
    </>
  );
}
