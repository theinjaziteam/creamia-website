"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import MarqueeBar from "../components/MarqueeBar";
import AnimatedSection from "../components/AnimatedSection";

// ─── Data ────────────────────────────────────────────────────────────────────

const premiumItems = [
  { name: "Tiramisu Classic",    desc: "Espresso-soaked ladyfingers, mascarpone cream, dark cocoa.",   tray: "$13", box: "$6"  },
  { name: "Tiramisu Brownie",    desc: "Fudgy brownie base meets tiramisu cream, perfectly layered.",   tray: "$14", box: "$7"  },
  { name: "Lotus Cheesecake",    desc: "Biscoff crust, velvety cream cheese, drizzle of Lotus gold.",  tray: "$13", box: "$6"  },
  { name: "Oreo Cheesecake",     desc: "Crushed Oreo crust, thick cream cheese, chocolate crumble.",   tray: "$13", box: "$6"  },
  { name: "Blueberry Cheesecake",desc: "Tart blueberry compote swirled into creamy cheesecake.",       tray: "$13", box: "$6"  },
  { name: "Raspberry Cheesecake",desc: "Tangy raspberry coulis ribboned through silky cheesecake.",    tray: "$13", box: "$6"  },
  { name: "Dream Cake",          desc: "Our signature mystery creation. Ask us what's inside today.",  tray: "—",   box: "Ask" },
];

const bavarianItems = [
  { name: "Strawberry Mousse Cake",  desc: "Silky strawberry mousse over a buttery biscuit base.",    tray: "$10", box: "$4" },
  { name: "Mango Bavarian Cream",    desc: "Tropical mango custard with a light vanilla finish.",      tray: "$10", box: "$4" },
  { name: "Banana Bavarian Cream",   desc: "Velvet banana cream with caramelised biscuit crumble.",   tray: "$10", box: "$4" },
  { name: "Halawa Bavarian Cream",   desc: "Lebanese halawa whipped into silky bavarian cream.",      tray: "$10", box: "$4" },
  { name: "Halawet el Riz",          desc: "Traditional Levantine rice cream, sweetened with rose.",  tray: "—",   box: "$4" },
  { name: "Moufataka",               desc: "Lebanese classic — rice pudding, caramel, nuts.",         tray: "—",   box: "$4" },
];

const boxSets = [
  { name: "Cozy Box",        count: "4 boxes",  bavarian: "$14", premium: "$20", note: "Perfect for two — or just you."          },
  { name: "Gathering Box",   count: "6 boxes",  bavarian: "$21", premium: "$27", note: "Bring joy to every table."               },
  { name: "Celebration Box", count: "12 boxes", bavarian: "$40", premium: "$50", note: "For the moments that deserve more."      },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

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
      {/* Logo */}
      <a href="#" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.75rem",
          fontWeight: 500,
          fontStyle: "italic",
          color: scrolled ? "var(--text)" : "#fff",
          letterSpacing: "-0.01em",
          transition: "color 0.3s",
        }}>
          Cremi<span style={{ color: "var(--accent)" }}>~</span>
        </span>
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="nav-links">
        {["Menu", "Boxes", "Story"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={linkStyle}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text-mid)" : "rgba(255,255,255,0.85)")}>
            {l}
          </a>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <a href="https://instagram.com/Cremi_lb" target="_blank" rel="noopener noreferrer"
          style={{ color: scrolled ? "var(--text-soft)" : "rgba(255,255,255,0.75)", transition: "color 0.2s", display: "flex" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "var(--text-soft)" : "rgba(255,255,255,0.75)")}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <a href="#menu" style={{
          background: "var(--accent)", color: "#fff",
          borderRadius: 6, padding: "9px 20px",
          fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-h)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}>
          Order
        </a>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} className="nav-hamburger"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none", flexDirection: "column", gap: 5 }}
          aria-label="Menu">
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: "block", width: 22, height: 2,
              background: scrolled ? "var(--text)" : "#fff", borderRadius: 2,
              transition: "transform 0.25s, opacity 0.25s",
              transform: open ? (i===0?"rotate(45deg) translateY(7px)":i===2?"rotate(-45deg) translateY(-7px)":"none"):"none",
              opacity: open && i===1 ? 0 : 1,
            }}/>
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0,
          background: "rgba(250,248,244,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "1.5rem 2.5rem 2rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}>
          {["Menu", "Boxes", "Story"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 500,
                letterSpacing: "0.06em", color: "var(--text)", textDecoration: "none", textTransform: "uppercase" }}>
              {l}
            </a>
          ))}
          <a href="#menu" onClick={() => setOpen(false)} style={{
            background: "var(--accent)", color: "#fff", borderRadius: 6,
            padding: "10px 20px", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem",
            fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            textDecoration: "none", width: "fit-content", marginTop: "0.25rem",
          }}>Order Now</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .nav-links { display: none !important; } .nav-hamburger { display: flex !important; } }
      `}</style>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden", background: "#1a0b04" }}>

      {/* Video — height 115% + shift up removes Gemini logo at bottom */}
      <video autoPlay muted loop playsInline
        style={{
          position: "absolute", inset: 0, width: "100%",
          height: "115%", objectFit: "cover", objectPosition: "center top",
          transform: "translateY(-4%)",
        }}>
        <source src="/hero.mp4" type="video/mp4"/>
      </video>

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, rgba(20,8,2,0.35) 0%, rgba(20,8,2,0.2) 40%, rgba(20,8,2,0.65) 85%, #1a0b04 100%)",
      }}/>

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 1.5rem",
      }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(4.5rem, 13vw, 10rem)",
            fontWeight: 400, fontStyle: "italic",
            lineHeight: 0.9, color: "#fff",
            letterSpacing: "-0.02em", marginBottom: "1.75rem",
          }}>
          Cremi<span style={{ color: "var(--accent)" }}>~</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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
            See the Menu
          </a>
          <a href="https://instagram.com/Cremi_lb" target="_blank" rel="noopener noreferrer" style={{
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
            @Cremi_lb
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
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

// ─── Intro strip ──────────────────────────────────────────────────────────────

function Intro() {
  return (
    <section style={{ background: "var(--bg)", padding: "6rem 2rem 5rem" }}>
      <AnimatedSection style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontWeight: 300, fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
          color: "var(--text)", lineHeight: 1.55, letterSpacing: "0.01em",
        }}>
          Born in a home kitchen in Lebanon, Cremi is built on one belief —
          dessert should be beautiful inside and out.
        </p>
        <div style={{ width: 40, height: 2, background: "var(--accent)", margin: "2rem auto 0", borderRadius: 1 }}/>
      </AnimatedSection>
    </section>
  );
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

function MenuItem({ name, desc, tray, box }: { name: string; desc: string; tray: string; box: string }) {
  return (
    <div style={{
      padding: "1.625rem 0",
      borderBottom: "1px solid var(--border)",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "1rem",
      alignItems: "start",
    }}>
      <div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.1875rem", fontWeight: 500,
          color: "var(--text)", lineHeight: 1.2,
          marginBottom: "0.35rem",
        }}>{name}</h3>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          fontSize: "0.875rem", color: "var(--text-soft)",
          lineHeight: 1.55,
        }}>{desc}</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {tray !== "—" && (
          <div style={{ marginBottom: "0.15rem" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", color: "var(--text-soft)", letterSpacing: "0.06em", marginRight: 6 }}>TRAY</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.125rem", fontWeight: 500, color: "var(--text)" }}>{tray}</span>
          </div>
        )}
        <div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", color: "var(--text-soft)", letterSpacing: "0.06em", marginRight: 6 }}>BOX</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.125rem", fontWeight: 500, color: box === "Ask" ? "var(--accent)" : "var(--text)" }}>{box}</span>
        </div>
      </div>
    </div>
  );
}

function MenuSection() {
  const [tab, setTab] = useState<"premium" | "bavarian">("premium");

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

        {/* Tab toggle */}
        <AnimatedSection delay={0.1}>
          <div style={{ display: "flex", gap: 4, marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
            {([["premium","Tiramisu & Cheesecakes"],["bavarian","Bavarian & Mousse"]] as const).map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif", fontSize: "0.8125rem",
                fontWeight: tab === id ? 600 : 400,
                color: tab === id ? "var(--text)" : "var(--text-soft)",
                padding: "0 0 1rem",
                marginRight: "1.75rem",
                borderBottom: tab === id ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "all 0.2s",
                letterSpacing: "0.02em",
              }}>{label}</button>
            ))}
          </div>
        </AnimatedSection>

        {/* Items */}
        <div>
          {(tab === "premium" ? premiumItems : bavarianItems).map((item, i) => (
            <AnimatedSection key={item.name} delay={i * 0.05}>
              <MenuItem {...item} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            fontSize: "0.875rem", color: "var(--text-soft)",
            marginTop: "2rem", textAlign: "center",
          }}>
            All items available as a <strong style={{ fontWeight: 500, color: "var(--text-mid)" }}>Medium Tray</strong> or <strong style={{ fontWeight: 500, color: "var(--text-mid)" }}>Small Box</strong>.
            Custom orders — <a href="https://instagram.com/Cremi_lb" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>DM us on Instagram</a>.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Box Sets ─────────────────────────────────────────────────────────────────

function BoxCard({ box }: { box: typeof boxSets[0] }) {
  const isMiddle = box.name === "Gathering Box";
  return (
    <div style={{
      background: isMiddle ? "var(--text)" : "var(--bg)",
      border: isMiddle ? "none" : "1px solid var(--border)",
      borderRadius: 12,
      padding: "2.5rem 2rem",
      display: "flex", flexDirection: "column", gap: "1rem",
      transition: "box-shadow 0.3s",
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(38,20,8,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
      <div>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem",
          letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
          color: isMiddle ? "rgba(255,255,255,0.45)" : "var(--text-soft)",
          marginBottom: "0.4rem",
        }}>{box.count}</p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.875rem", fontWeight: 500, lineHeight: 1,
          color: isMiddle ? "#fff" : "var(--text)",
        }}>{box.name}</h3>
      </div>

      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
        fontSize: "1rem", fontWeight: 300,
        color: isMiddle ? "rgba(255,255,255,0.55)" : "var(--text-soft)",
      }}>{box.note}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", margin: "0.5rem 0" }}>
        {[["Bavarian / Mousse", box.bavarian], ["Tiramisu / Cheesecake", box.premium]].map(([label, price]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.6rem 0.875rem",
            background: isMiddle ? "rgba(255,255,255,0.06)" : "var(--bg-warm)",
            borderRadius: 6,
          }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8125rem", fontWeight: 300, color: isMiddle ? "rgba(255,255,255,0.7)" : "var(--text-mid)" }}>{label}</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.125rem", fontWeight: 500, color: isMiddle ? "#fff" : "var(--text)" }}>{price}</span>
          </div>
        ))}
      </div>

      <a href="https://instagram.com/Cremi_lb" target="_blank" rel="noopener noreferrer" style={{
        display: "block", textAlign: "center",
        background: isMiddle ? "var(--accent)" : "transparent",
        color: isMiddle ? "#fff" : "var(--accent)",
        border: isMiddle ? "none" : "1px solid var(--accent)",
        borderRadius: 6, padding: "11px 0",
        fontFamily: "'Inter', sans-serif", fontSize: "0.75rem",
        fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        textDecoration: "none", transition: "opacity 0.2s",
        marginTop: "auto",
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
        Order This Box
      </a>
    </div>
  );
}

function BoxSets() {
  return (
    <section id="boxes" style={{ background: "var(--bg)", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <AnimatedSection>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 500 }}>Gift Boxes</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            fontWeight: 400, lineHeight: 1,
            color: "var(--text)", marginBottom: "3rem",
          }}>
            Pick Your Occasion
          </h2>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
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

// ─── Story ────────────────────────────────────────────────────────────────────

function Story() {
  return (
    <section id="story" style={{ background: "var(--bg-warm)", padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
        <AnimatedSection>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem", fontWeight: 500 }}>Our Story</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)",
            fontWeight: 400, lineHeight: 1.1,
            color: "var(--text)", marginBottom: "2rem",
          }}>
            Made Fresh, Every Order
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.8,
            marginBottom: "1.25rem",
          }}>
            Cremi started as a love of layers — handcrafted desserts that look as good as they taste. Every box is made fresh on order, never sitting on a shelf.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 300,
            fontSize: "1rem", color: "var(--text-mid)", lineHeight: 1.8,
          }}>
            We present every creation in a clear box so you see the beauty before you taste it. Because a beautiful dessert deserves to be shown off.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Order CTA ────────────────────────────────────────────────────────────────

function OrderCTA() {
  return (
    <section style={{ background: "var(--text)", padding: "8rem 2rem", textAlign: "center" }}>
      <AnimatedSection style={{ maxWidth: 600, margin: "0 auto" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "1rem", fontWeight: 500 }}>Order Now</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
          fontWeight: 400, lineHeight: 1,
          color: "#fff", marginBottom: "1.25rem",
        }}>
          Ready to indulge?
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          fontSize: "1rem", color: "rgba(255,255,255,0.5)",
          lineHeight: 1.75, marginBottom: "2.75rem",
        }}>
          Every Cremi box is made fresh on order.<br/>DM us on Instagram or WhatsApp and we'll handle the rest.
        </p>
        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://instagram.com/Cremi_lb" target="_blank" rel="noopener noreferrer" style={{
            background: "var(--accent)", color: "#fff",
            borderRadius: 6, padding: "13px 32px",
            fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
            fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-h)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            Order on Instagram
          </a>
          <a href="https://wa.me/96176000000?text=Hi%2C%20I%27d%20like%20to%20order%20from%20Cremi~" target="_blank" rel="noopener noreferrer" style={{
            background: "transparent", color: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 6, padding: "13px 28px",
            fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
            fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21l1.9-5.7A8.5 8.5 0 1 1 7.7 17l-4.7 4z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      background: "var(--bg)", borderTop: "1px solid var(--border)",
      padding: "3rem 2rem",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", textAlign: "center",
    }}>
      <a href="#" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "1.75rem", fontWeight: 500, color: "var(--text)", letterSpacing: "-0.01em",
        }}>Cremi<span style={{ color: "var(--accent)" }}>~</span></span>
      </a>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.9375rem", color: "var(--text-soft)" }}>
        Every spoon hits a new layer.
      </p>
      <a href="https://instagram.com/Cremi_lb" target="_blank" rel="noopener noreferrer"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--accent)", textDecoration: "none", textTransform: "uppercase", fontWeight: 500 }}>
        @Cremi_lb
      </a>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "var(--text-soft)", letterSpacing: "0.04em" }}>
        © {new Date().getFullYear()} Cremi~. Lebanon.
      </p>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Navbar/>
      <main>
        <Hero/>
        <MarqueeBar/>
        <Intro/>
        <MenuSection/>
        <BoxSets/>
        <Story/>
        <OrderCTA/>
      </main>
      <Footer/>
    </>
  );
}
