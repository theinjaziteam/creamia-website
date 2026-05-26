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
    "Dream Cake",
    "Halawa Cream",
  ];
  return (
    <div className="overflow-hidden py-3" style={{ background: "#2C1810", borderTop: "1px solid rgba(196,98,45,0.3)", borderBottom: "1px solid rgba(196,98,45,0.3)" }}>
      <div className="marquee-track flex gap-8 whitespace-nowrap" style={{ width: "max-content" }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8 shrink-0">
            <span style={{ fontFamily: "'Karla', sans-serif", fontSize: "0.8125rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(251,245,236,0.6)" }}>
              {item}
            </span>
            <span style={{ color: "#C4622D", fontSize: "0.6rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
