"use client";

export default function MarqueeBar() {
  const items = [
    "Tiramisu Classic",
    "Lotus Cheesecake",
    "Oreo Cheesecake",
    "Strawberry Mousse",
    "Mango Bavarian",
    "Blueberry Cheesecake",
    "Raspberry Cheesecake",
    "Tiramisu Brownie",
    "Halawa Cream",
    "Dream Cake",
    "Halawet el Riz",
    "Moufataka",
  ];

  return (
    <div
      style={{
        overflow: "hidden",
        padding: "14px 0",
        background: "#C4622D",
        borderTop: "1px solid rgba(255,255,255,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <div
        className="marquee-track"
        style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", width: "max-content" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexShrink: 0 }}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.6875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.92)",
                fontWeight: 400,
              }}
            >
              {item}
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.45rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
