import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cremi~ | Every Spoon Hits a New Layer",
  description: "Handcrafted tiramisu and cheesecakes. Order your Cremi box — Cozy, Gathering, or Celebration.",
  openGraph: {
    title: "Cremi~ | Every Spoon Hits a New Layer",
    description: "Handcrafted tiramisu and cheesecakes in Lebanon.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
