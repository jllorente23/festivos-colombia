import type { Metadata } from "next";
import "./globals.css";
import { yearWindow } from "@/lib/holidays";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://festivoscolombia.co";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Festivos Colombia: calendario de días festivos",
    template: "%s | Festivos Colombia",
  },
  description:
    "Consulta si hoy es festivo en Colombia y el calendario completo de días festivos por año, con puentes, Semana Santa y la Ley Emiliani.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Festivos Colombia",
    title: "Festivos Colombia: calendario de días festivos",
    description:
      "Mira si hoy es festivo en Colombia y el calendario completo de festivos por año.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const years = yearWindow();
  return (
    <html lang="es">
      <body>
        <header className="topbar">
          <a className="brand" href="/">
            Festivos <b>Colombia</b>
          </a>
        </header>
        {children}
        <footer className="site-footer">
          <div className="inner">
            <h4>Festivos por año</h4>
            <nav className="year-links">
              {years.map((y) => (
                <a key={y} href={`/festivos/${y}`}>
                  {y}
                </a>
              ))}
            </nav>
            <p>
              Fechas calculadas con la Ley 51 de 1983 (Ley Emiliani) y la Ley 2578 de 2026
              (Día de la Virgen del Rosario de Chiquinquirá). Los festivos de Semana Santa se
              calculan a partir de la fecha de Pascua.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
