import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import FooterYearLinks from "@/components/FooterYearLinks";
import MotionProvider from "@/components/MotionProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { yearWindow } from "@/lib/holidays";

const themeScript = `(function(){try{var s=localStorage.getItem("theme");var t=s||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;}catch(e){}})();`;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://festivoscolombia.link";

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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="topbar">
          <a className="brand" href="/">
            Festivos <b>Colombia</b>
          </a>
          <ThemeToggle />
        </header>
        <MotionProvider>{children}</MotionProvider>
        <footer className="site-footer">
          <div className="inner">
            <h4>Festivos por año</h4>
            <FooterYearLinks years={years} />
            <p>
              Fechas calculadas con la Ley 51 de 1983 (Ley Emiliani) y la Ley 2578 de 2026
              (Día de la Virgen del Rosario de Chiquinquirá). Los festivos de Semana Santa se
              calculan a partir de la fecha de Pascua.
            </p>
            <p className="footer-credit">
              Created by{" "}
              <a href="https://www.javierllorente.dev" target="_blank" rel="noopener noreferrer">
                www.javierllorente.dev
              </a>
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
