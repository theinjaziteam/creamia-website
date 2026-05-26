"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body
        style={{
          background: "#1A0B04",
          color: "#EDEADC",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "1.5rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            fontFamily: "Impact, sans-serif",
            fontSize: "5rem",
            color: "#C4622D",
            lineHeight: 1,
            letterSpacing: "0.05em",
          }}
        >
          OOPS
        </div>
        <p style={{ opacity: 0.65, fontSize: "1rem" }}>Something went wrong.</p>
        <button
          onClick={reset}
          style={{
            background: "#C4622D",
            color: "#fff",
            border: "none",
            borderRadius: "24px",
            padding: "12px 28px",
            cursor: "pointer",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
