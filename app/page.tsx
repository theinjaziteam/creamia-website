"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import MarqueeBar from "../components/MarqueeBar";
import AnimatedSection from "../components/AnimatedSection";


// ─── Types ──────────────────────────────────────────────────────────────────

interface Product {
  name: string;
  desc: string;
  tray?: string;
  box?: string;
  bg: string;
  text: string;
  accent: string;
  layer1: string;
  layer2: string;
  layer3: string;
}

interface BoxCollection {
  name: string;
  subtitle: string;
  count: number;
  priceBavarian: string;
  priceTiramisu: string;
  bg: string;
  text: string;
  accent: string;
  icon: string;
  tagline: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const bavarianProducts: Product[] = [
  {
    name: "Strawberry Mousse Cake",
    desc: "Silky strawberry mousse over a buttery biscuit base — light, fruity, irresistible.",
    tray: "$10",
    box: "$4",
    bg: "#F5D0D0",
    text: "#2C1810",
    accent: "#C4622D",
    layer1: "#F5D0D0",
    layer2: "#FBEEEE",
    layer3: "#E8A0A0",
  },
  {
    name: "Mango Bavarian Cream",
    desc: "Tropical mango custard with a vanilla cream finish — sunshine in every spoon.",
    tray: "$10",
    box: "$4",
    bg: "#F5E8C0",
    text: "#2C1810",
    accent: "#C4871F",
    layer1: "#F5E8C0",
    layer2: "#FBF0D5",
    layer3: "#E8C860",
  },
  {
    name: "Banana Bavarian Cream",
    desc: "Velvet banana cream with a caramelised biscuit crumble — pure nostalgia.",
    tray: "$10",
    box: "$4",
    bg: "#F5EDCC",
    text: "#2C1810",
    accent: "#C4871F",
    layer1: "#F5EDCC",
    layer2: "#FBF4DD",
    layer3: "#D4B84A",
  },
  {
    name: "Halawa Bavarian Cream",
    desc: "Lebanese halawa whipped into silky bavarian cream — a sweet heritage moment.",
    tray: "$10",
    box: "$4",
    bg: "#F2E8D5",
    text: "#2C1810",
    accent: "#8B5E3C",
    layer1: "#F2E8D5",
    layer2: "#FBF5EC",
    layer3: "#D4B88A",
  },
  {
    name: "Halawet el Riz",
    desc: "Traditional Levantine rice cream dessert, lightly sweetened with rose water.",
    tray: undefined,
    box: "$4",
    bg: "#EEE8F5",
    text: "#2C1810",
    accent: "#8B5E8C",
    layer1: "#EEE8F5",
    layer2: "#F8F4FC",
    layer3: "#C8A8D0",
  },
  {
    name: "Moufataka (M.fataa)",
    desc: "A beloved Lebanese classic — rice pudding layered with caramelised sugar and nuts.",
    tray: undefined,
    box: "$4",
    bg: "#F0EAD8",
    text: "#2C1810",
    accent: "#C4871F",
    layer1: "#F0EAD8",
    layer2: "#FBF5EC",
    layer3: "#C8A060",
  },
];

const tiramisuProducts: Product[] = [
  {
    name: "Tiramisu Classic",
    desc: "Espresso-soaked ladyfingers, cloud-like mascarpone cream, a veil of dark cocoa.",
    tray: "$13",
    box: "$6",
    bg: "#3D2010",
    text: "#FBF5EC",
    accent: "#C4871F",
    layer1: "#3D2010",
    layer2: "#2C1810",
    layer3: "#C4871F",
  },
  {
    name: "Tiramisu Brownie",
    desc: "Fudgy brownie base meets tiramisu cream — the best of both worlds, perfectly layered.",
    tray: "$14",
    box: "$7",
    bg: "#1A0E08",
    text: "#FBF5EC",
    accent: "#C4622D",
    layer1: "#1A0E08",
    layer2: "#3D2010",
    layer3: "#C4622D",
  },
  {
    name: "Lotus Cheesecake",
    desc: "Caramelised Lotus biscoff base, velvety cream cheese, a drizzle of liquid gold.",
    tray: "$13",
    box: "$6",
    bg: "#F3D0B8",
    text: "#2C1810",
    accent: "#C4622D",
    layer1: "#F3D0B8",
    layer2: "#FBEEDF",
    layer3: "#C4622D",
  },
  {
    name: "Oreo Cheesecake",
    desc: "Crushed Oreo crust, thick cream cheese cloud, chocolate crumble crown.",
    tray: "$13",
    box: "$6",
    bg: "#1A1A1A",
    text: "#FFFFFF",
    accent: "#C4871F",
    layer1: "#1A1A1A",
    layer2: "#2D2D2D",
    layer3: "#555555",
  },
  {
    name: "Blueberry Cheesecake",
    desc: "Tart blueberry compote swirled into creamy cheesecake — bold, beautiful, berry.",
    tray: "$13",
    box: "$6",
    bg: "#2D1B5E",
    text: "#FFFFFF",
    accent: "#9B8FE0",
    layer1: "#2D1B5E",
    layer2: "#1A0E40",
    layer3: "#6B5BD0",
  },
  {
    name: "Raspberry Cheesecake",
    desc: "Tangy raspberry coulis ribboned through silky cheesecake — sharp, sweet, stunning.",
    tray: "$13",
    box: "$6",
    bg: "#5E1B2D",
    text: "#FFFFFF",
    accent: "#E87090",
    layer1: "#5E1B2D",
    layer2: "#3D0E1B",
    layer3: "#C44060",
  },
  {
    name: "Dream Cake",
    desc: "Our signature creation — layers of fantasy. Ask us what's inside today.",
    tray: "Ask",
    box: "Ask",
    bg: "linear-gradient(135deg, #2D1B5E 0%, #5E1B2D 50%, #C4622D 100%)",
    text: "#FFFFFF",
    accent: "#FFD700",
    layer1: "#2D1B5E",
    layer2: "#5E1B2D",
    layer3: "#C4622D",
  },
];

const boxCollections: BoxCollection[] = [
  {
    name: "Cozy Box",
    subtitle: "4 Boxes",
    count: 4,
    priceBavarian: "$14",
    priceTiramisu: "$20",
    bg: "#F2E8D5",
    text: "#2C1810",
    accent: "#C4622D",
    icon: "02",
    tagline: "Perfect for two — or just you.",
  },
  {
    name: "Gathering Box",
    subtitle: "6 Boxes",
    count: 6,
    priceBavarian: "$21",
    priceTiramisu: "$27",
    bg: "#2C1810",
    text: "#FBF5EC",
    accent: "#C4871F",
    icon: "04",
    tagline: "Bring joy to every table.",
  },
  {
    name: "Celebration Box",
    subtitle: "12 Boxes",
    count: 12,
    priceBavarian: "$40",
    priceTiramisu: "$50",
    bg: "#C4622D",
    text: "#FBF5EC",
    accent: "#FFD700",
    icon: "08",
    tagline: "For the moments that deserve more.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const isDark =
    product.bg.startsWith("linear") ||
    product.bg.startsWith("#1") ||
    product.bg.startsWith("#2") ||
    product.bg.startsWith("#3") ||
    product.bg.startsWith("#5");

  return (
    <div
      className="card-hover rounded-2xl overflow-hidden flex flex-col"
      style={{ minHeight: "400px" }}
    >
      {/* Decorative dessert illustration area */}
      <div
        style={{
          height: "160px",
          background: product.bg.startsWith("linear")
            ? product.bg
            : undefined,
          backgroundColor: !product.bg.startsWith("linear")
            ? product.bg
            : undefined,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Layered dessert visual */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: product.layer3,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: 0,
            right: 0,
            height: "30%",
            background: product.layer2,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: `radial-gradient(ellipse at 50% 0%, ${product.accent}55 0%, transparent 70%)`,
          }}
        />
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "16px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: product.accent,
            opacity: 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: product.accent,
            opacity: 0.2,
          }}
        />
        {/* Price badge */}
        {product.box && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: product.accent,
              color: "#fff",
              borderRadius: "9999px",
              padding: "4px 12px",
              fontSize: "0.75rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            From {product.box}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: "1.25rem 1.5rem 1.5rem",
          background: !product.bg.startsWith("linear") ? product.bg : "#1A1A2E",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "1.125rem",
            color: product.text,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: product.text,
            opacity: 0.75,
            lineHeight: 1.55,
            flex: 1,
          }}
        >
          {product.desc}
        </p>
        {/* Pricing row */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          {product.tray && product.tray !== "Ask" && (
            <span
              style={{
                fontSize: "0.8125rem",
                color: product.text,
                opacity: 0.7,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Medium Tray{" "}
              <span style={{ fontWeight: 700, opacity: 1, color: product.accent }}>
                {product.tray}
              </span>
            </span>
          )}
          {product.box && product.box !== "Ask" && (
            <span
              style={{
                fontSize: "0.8125rem",
                color: product.text,
                opacity: 0.7,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Small Box{" "}
              <span style={{ fontWeight: 700, opacity: 1, color: product.accent }}>
                {product.box}
              </span>
            </span>
          )}
          {product.box === "Ask" && (
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: product.accent,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              Price on Request
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BoxCard({ box }: { box: BoxCollection }) {
  return (
    <div
      className="card-3d rounded-3xl overflow-hidden relative"
      style={{ background: box.bg, padding: "2.5rem 2rem 2rem" }}
    >
      {/* Stacked box visual */}
      <div style={{ position: "relative", height: "120px", marginBottom: "1.5rem" }}>
        {[...Array(Math.min(box.count, 4))].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${8 + i * 6}px`,
              bottom: `${i * 8}px`,
              width: `${140 - i * 8}px`,
              height: "44px",
              borderRadius: "10px",
              background:
                i % 2 === 0
                  ? `rgba(255,255,255,0.18)`
                  : `rgba(255,255,255,0.08)`,
              border: `1px solid rgba(255,255,255,0.22)`,
              backdropFilter: "blur(4px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
        ))}
        <span
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            fontSize: "3rem",
            lineHeight: 1,
          }}
        >
          {box.icon}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: box.accent,
            marginBottom: "0.35rem",
          }}
        >
          {box.subtitle}
        </div>
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: box.text,
            marginBottom: "0.5rem",
          }}
        >
          {box.name}
        </h3>
        <p
          style={{
            fontSize: "0.9rem",
            color: box.text,
            opacity: 0.7,
            marginBottom: "1.5rem",
            fontStyle: "italic",
          }}
        >
          {box.tagline}
        </p>

        {/* Price options */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "0.6rem 1rem",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: box.text,
                opacity: 0.8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Bavarian / Mousse
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: box.accent,
              }}
            >
              {box.priceBavarian}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "0.6rem 1rem",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: box.text,
                opacity: 0.8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Tiramisu / Cheesecake
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: box.accent,
              }}
            >
              {box.priceTiramisu}
            </span>
          </div>
        </div>

        <a
          href="https://www.instagram.com/Cremi_lb"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: box.accent,
            color: box.text === "#FBF5EC" ? "#fff" : box.text,
            borderRadius: "9999px",
            padding: "0.7rem 1.5rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "opacity 0.2s ease",
          }}
        >
          Order This Box
        </a>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        height: "72px",
        background: "rgba(251,245,236,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(196,98,45,0.12)",
      }}
    >
      {/* Logo */}
      <a
        href="#"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#C4622D",
          textDecoration: "none",
          letterSpacing: "0.04em",
        }}
      >
        Cremi~
      </a>

      {/* Desktop nav links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
        }}
        className="hidden md:flex"
      >
        {["Menu", "Boxes", "Our Story", "Order"].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(" ", "-")}`}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#2C1810",
              textDecoration: "none",
              opacity: 0.75,
              transition: "opacity 0.2s, color 0.2s",
            }}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Instagram icon */}
        <a
          href="https://www.instagram.com/Cremi_lb"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2C1810", opacity: 0.7, transition: "opacity 0.2s" }}
          aria-label="Cremi Instagram"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        {/* Order Now CTA */}
        <a
          href="#order"
          className="btn-lotus"
          style={{ padding: "0.6rem 1.4rem", fontSize: "0.8125rem" }}
        >
          Order Now
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <span style={{ width: "22px", height: "2px", background: "#2C1810", display: "block", borderRadius: "2px", transition: "transform 0.2s", transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
          <span style={{ width: "22px", height: "2px", background: "#2C1810", display: "block", borderRadius: "2px", transition: "opacity 0.2s", opacity: open ? 0 : 1 }} />
          <span style={{ width: "22px", height: "2px", background: "#2C1810", display: "block", borderRadius: "2px", transition: "transform 0.2s", transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "72px",
            left: 0,
            right: 0,
            background: "#FBF5EC",
            borderBottom: "1px solid rgba(196,98,45,0.15)",
            padding: "1.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {["Menu", "Boxes", "Our Story", "Order"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#2C1810",
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "#0D0704",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "72px",
      }}
    >
      {/* Warm ambient glow from the right column */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "55%",
        height: "100%",
        background: "radial-gradient(ellipse at 70% 50%, rgba(157,94,58,0.18) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "3rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: "4rem",
          alignItems: "center",
          width: "100%",
        }}
        className="hero-grid"
      >
        {/* ── Left: Copy ── */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "1px solid rgba(196,98,45,0.3)",
              borderRadius: "9999px",
              padding: "0.3rem 0.9rem",
              marginBottom: "2.25rem",
            }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C4622D", display: "inline-block", flexShrink: 0 }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(196,98,45,0.85)",
            }}>
              Lebanese Desserts · Beirut
            </span>
          </motion.div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
            fontWeight: 600,
            lineHeight: 1.05,
            color: "#FBF5EC",
            marginBottom: "1.75rem",
            letterSpacing: "-0.01em",
          }}>
            {["Every", "Spoon", "Hits a", "New Layer"].map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "block",
                  color: line === "New Layer" ? "#C4622D" : "#FBF5EC",
                  fontStyle: line === "New Layer" ? "italic" : "normal",
                  fontWeight: line === "New Layer" ? 500 : 600,
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1.0625rem",
              color: "rgba(251,245,236,0.5)",
              lineHeight: 1.8,
              maxWidth: "400px",
              marginBottom: "2.5rem",
              fontWeight: 300,
            }}
          >
            Handcrafted tiramisu, cheesecakes &amp; Bavarian creams in beautiful clear boxes. Made fresh in Lebanon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.8 }}
            style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", alignItems: "center" }}
          >
            <a href="#menu" className="btn-lotus">Order Now</a>
            <a
              href="https://www.instagram.com/Cremi_lb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ borderColor: "rgba(251,245,236,0.15)", color: "rgba(251,245,236,0.6)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              @Cremi_lb
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            style={{
              display: "flex",
              gap: "3rem",
              marginTop: "3.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid rgba(251,245,236,0.06)",
            }}
          >
            {[["10+", "Flavours"], ["3", "Box sizes"], ["LB", "Lebanon"]].map(([val, label]) => (
              <div key={label}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "#C4622D",
                  lineHeight: 1,
                  marginBottom: "0.2rem",
                }}>
                  {val}
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  color: "rgba(251,245,236,0.3)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Video ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative" }}
        >
          {/* Video container with rounded crop */}
          <div style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            aspectRatio: "4/3",
            boxShadow: "0 50px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(157,94,58,0.12)",
          }}>
            {/* Watermark cover — exact bg color sampled from video */}
            <div style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "90px",
              height: "70px",
              background: "linear-gradient(135deg, transparent 0%, #9d5e39 55%)",
              zIndex: 10,
              pointerEvents: "none",
            }} />
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            >
              <source src="/hero-box.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Floating badge — top left of video */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.2 }}
            style={{
              position: "absolute",
              top: "-14px",
              left: "20px",
              background: "rgba(13,7,4,0.9)",
              border: "1px solid rgba(196,98,45,0.2)",
              backdropFilter: "blur(16px)",
              borderRadius: "10px",
              padding: "0.6rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C4622D", flexShrink: 0 }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "rgba(251,245,236,0.8)",
              letterSpacing: "0.04em",
            }}>
              Fresh daily · Order via DM
            </span>
          </motion.div>

          {/* Price badge — bottom left */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 1.4 }}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "-16px",
              background: "#C4622D",
              borderRadius: "10px",
              padding: "0.6rem 1.1rem",
            }}
          >
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#FBF5EC",
              lineHeight: 1,
            }}>
              From $4
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(251,245,236,0.75)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}>
              Per box
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.35rem",
        }}
      >
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(251,245,236,0.2)",
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ color: "rgba(196,98,45,0.35)", fontSize: "0.9rem" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}



// ─── Our Story ────────────────────────────────────────────────────────────────

function OurStory() {
  return (
    <section
      id="our-story"
      style={{
        background: "#FBF5EC",
        padding: "8rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "100%",
          background: "radial-gradient(ellipse at 100% 50%, rgba(196,98,45,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
          className="story-grid"
        >
          {/* Left: Visual */}
          <AnimatedSection delay={0}>
            <div style={{ position: "relative" }}>
              {/* Large decorative circle */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  maxWidth: "480px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #F3D0B8 0%, #F2E8D5 40%, #E8D9C0 100%)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* Inner layers suggesting a dessert cross-section */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "30%",
                    background: "#8B5E3C",
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "30%",
                    width: "100%",
                    height: "25%",
                    background: "#F5ECD7",
                    opacity: 0.8,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "55%",
                    width: "100%",
                    height: "20%",
                    background: "#FBF5EC",
                    opacity: 0.9,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "10%",
                    width: "100%",
                    height: "15%",
                    background: "radial-gradient(ellipse at 50% 0%, rgba(196,98,45,0.3) 0%, transparent 70%)",
                  }}
                />
                {/* Center text */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "4rem",
                      color: "#2C1810",
                      opacity: 0.15,
                      lineHeight: 1,
                    }}
                  >
                    Cremi~
                  </div>
                </div>
              </div>

              {/* Floating tag */}
              <div
                style={{
                  position: "absolute",
                  top: "-1rem",
                  right: "-1rem",
                  background: "#2C1810",
                  color: "#FBF5EC",
                  borderRadius: "16px",
                  padding: "1rem 1.25rem",
                  boxShadow: "0 8px 32px rgba(44,24,16,0.25)",
                }}
              >
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#C4622D", marginBottom: "0.25rem" }}>
                  Since
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 700 }}>
                  2023
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Text */}
          <div>
            <AnimatedSection delay={0.1}>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C4622D",
                  marginBottom: "1rem",
                }}
              >
                Our Story
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  fontWeight: 700,
                  color: "#2C1810",
                  lineHeight: 1.2,
                  marginBottom: "1.5rem",
                }}
              >
                Born from a Love of Layers
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.0625rem",
                  color: "#3D2418",
                  opacity: 0.8,
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                Cremi~ was born in a home kitchen in Lebanon, from a simple obsession: desserts that tell a story in every bite. Each box holds carefully crafted layers — biscuit, cream, flavor, repeat.
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.0625rem",
                  color: "#3D2418",
                  opacity: 0.8,
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                }}
              >
                We believe indulgence deserves presentation. That&apos;s why every Cremi creation arrives in its signature clear box — so you see the beauty before you taste it. From classic tiramisu to Lotus cheesecake, every spoon really does hit a new layer.
              </p>

              {/* Values */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { label: "Made Fresh", desc: "Every order crafted on demand" },
                  { label: "Presented Beautifully", desc: "Beautiful inside & out" },
                  { label: "Lebanese Heart", desc: "Local ingredients, global flavors" },
                ].map((v) => (
                  <div key={v.label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "rgba(196,98,45,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        flexShrink: 0,
                      }}
                    >
                      
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.9375rem", color: "#2C1810" }}>
                        {v.label}
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "#8B6B55" }}>
                        {v.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Menu Section ─────────────────────────────────────────────────────────────

function MenuSection() {
  const [activeTab, setActiveTab] = useState<"tiramisu" | "bavarian">("tiramisu");

  return (
    <section
      id="menu"
      style={{
        background: "#F2E8D5",
        padding: "8rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(196,98,45,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(196,135,31,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              style={{
                fontSize: "0.8125rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C4622D",
                marginBottom: "0.75rem",
              }}
            >
              The Menu
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#2C1810",
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              Choose Your Layer
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.0625rem",
                color: "#8B6B55",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Every flavour, available as a medium tray or individual small box.
            </p>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection delay={0.1}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                background: "#FBF5EC",
                borderRadius: "9999px",
                padding: "6px",
                display: "inline-flex",
                gap: "4px",
                boxShadow: "0 2px 12px rgba(44,24,16,0.08)",
              }}
            >
              {(
                [
                  { id: "tiramisu", label: "Tiramisu & Cheesecakes" },
                  { id: "bavarian", label: "Bavarian & Mousse" },
                ] as { id: "tiramisu" | "bavarian"; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    borderRadius: "9999px",
                    padding: "0.65rem 1.5rem",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    letterSpacing: "0.04em",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    background: activeTab === tab.id ? "#C4622D" : "transparent",
                    color: activeTab === tab.id ? "#fff" : "#8B6B55",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Product Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {(activeTab === "tiramisu" ? tiramisuProducts : bavarianProducts).map((product, i) => (
            <AnimatedSection key={product.name} delay={i * 0.07}>
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </motion.div>

        {/* Bottom note */}
        <AnimatedSection delay={0.3}>
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              padding: "1.5rem 2rem",
              background: "rgba(44,24,16,0.05)",
              borderRadius: "16px",
              border: "1px solid rgba(196,98,45,0.12)",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9375rem",
                color: "#8B6B55",
              }}
            >
              All items available as <strong style={{ color: "#2C1810" }}>Medium Tray</strong> or{" "}
              <strong style={{ color: "#2C1810" }}>Small Individual Box</strong>. Custom orders welcome — DM us on Instagram.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Box Collections ──────────────────────────────────────────────────────────

function BoxCollections() {
  return (
    <section
      id="boxes"
      style={{
        background: "#2C1810",
        padding: "8rem 2rem",
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
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(196,98,45,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              style={{
                fontSize: "0.8125rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C4622D",
                marginBottom: "0.75rem",
              }}
            >
              Box Collections
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#FBF5EC",
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              Pick Your Occasion
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.0625rem",
                color: "rgba(251,245,236,0.55)",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Mix and match your favourite flavours. Bavarian or Tiramisu — your call.
            </p>
          </div>
        </AnimatedSection>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {boxCollections.map((box, i) => (
            <AnimatedSection key={box.name} delay={i * 0.1}>
              <BoxCard box={box} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Order CTA ────────────────────────────────────────────────────────────────

function OrderCTA() {
  return (
    <section
      id="order"
      style={{
        background: "#FBF5EC",
        padding: "8rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,98,45,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,135,31,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <div
            style={{
              fontSize: "0.8125rem",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C4622D",
              marginBottom: "1rem",
            }}
          >
            Ready to Order?
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 700,
              color: "#2C1810",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            Ready to Indulge?
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "1.125rem",
              color: "#8B6B55",
              lineHeight: 1.75,
              marginBottom: "3rem",
              maxWidth: "520px",
              margin: "0 auto 3rem",
            }}
          >
            Every Cremi box is made fresh on order. Send us a message on Instagram or WhatsApp and we&apos;ll take care of the rest.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/Cremi_lb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lotus"
              style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              Order on Instagram
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/96176000000?text=Hi%2C%20I'd%20like%20to%20order%20from%20Cremi~"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.9-5.7A8.5 8.5 0 1 1 7.7 17l-4.7 4z" />
              </svg>
              Order on WhatsApp
            </a>
          </div>
        </AnimatedSection>

        {/* Tagline repeat */}
        <AnimatedSection delay={0.3}>
          <div
            style={{
              marginTop: "4rem",
              paddingTop: "3rem",
              borderTop: "1px solid rgba(196,98,45,0.15)",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "1.5rem",
                color: "#C4622D",
                opacity: 0.7,
              }}
            >
              "Every Spoon Hits a New Layer"
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        background: "#2C1810",
        borderTop: "1px solid rgba(196,98,45,0.2)",
        padding: "3rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "2rem",
            color: "#C4622D",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          Cremi~
        </a>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.9375rem",
            color: "rgba(251,245,236,0.45)",
          }}
        >
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
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#C4622D",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          @Cremi_lb
        </a>

        <div
          style={{
            width: "40px",
            height: "1px",
            background: "rgba(196,98,45,0.3)",
          }}
        />

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8125rem",
            color: "rgba(251,245,236,0.3)",
            letterSpacing: "0.06em",
          }}
        >
          &copy; {new Date().getFullYear()} Cremi~. All rights reserved. Lebanon.
        </p>
      </div>
    </footer>
  );
}

// ─── Responsive style overrides (injected via style tag) ───────────────────────

function ResponsiveStyles() {
  return (
    <style>{`
      @media (max-width: 768px) {
        .hero-grid { grid-template-columns: 1fr !important; }
        .story-grid { grid-template-columns: 1fr !important; }
        .hero-grid > div:last-child { display: none; }
      }
      @media (min-width: 769px) {
        .md\\:flex { display: flex !important; }
        .md\\:hidden { display: none !important; }
      }
      @media (max-width: 768px) {
        .md\\:flex { display: none !important; }
        .md\\:hidden { display: flex !important; }
      }
    `}</style>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <ResponsiveStyles />
      <Navbar />
      <main>
        <Hero />
        <MarqueeBar />
        <OurStory />
        <MenuSection />
        <BoxCollections />
        <OrderCTA />
      </main>
      <Footer />
    </>
  );
}
