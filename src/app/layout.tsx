import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apex Rota",
  description: "Teams rota manager",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0b1220", color: "#e5e7eb" }}>
        <header style={{ padding: 16, borderBottom: "1px solid #1f2937", background: "#070d19" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ fontWeight: 800 }}>Apex Rota</div>
            <nav style={{ display: "flex", gap: 12, opacity: 0.9 }}>
              <a href="/" style={{ color: "inherit", textDecoration: "none" }}>Dashboard</a>
              <a href="/staff" style={{ color: "inherit", textDecoration: "none" }}>Staff</a>
              <a href="/rota" style={{ color: "inherit", textDecoration: "none" }}>Rota Builder</a>
            </nav>
          </div>
        </header>

        <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
