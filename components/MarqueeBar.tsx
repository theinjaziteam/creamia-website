"use client";

const items = [
  "Classic Tiramisu", "Lotus Cheesecake", "Oreo Cheesecake",
  "Strawberry Bavaroise", "Mango Bavaroise", "Blueberry Cheesecake",
  "Raspberry Cheesecake", "Brownie Tiramisu", "Halawa Bavaroise",
  "Chocolate Dubai Cake", "Halawet el Riz", "Moufataka",
];

export default function MarqueeBar() {
  return (
    <div style={{ overflow: "hidden", padding: "13px 0", background: "var(--accent)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="marquee-track" style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "2.5rem", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
              {item}
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.4rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
