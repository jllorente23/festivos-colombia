import type { Metadata } from "next";
import TodayHero from "@/components/TodayHero";
import HolidayTable from "@/components/HolidayTable";
import JsonLd from "@/components/JsonLd";
import { currentYear, getHolidays } from "@/lib/holidays";

export const revalidate = 86400; // se reevalúa a diario para mantener el año actual al día

export function generateMetadata(): Metadata {
  const y = currentYear();
  return {
    title: `Festivos Colombia ${y}: calendario, puentes y próximo festivo`,
    description: `Mira si hoy es festivo en Colombia y consulta el calendario completo de festivos ${y}, con puentes, Semana Santa, fechas especiales y la Ley Emiliani.`,
    alternates: { canonical: "/" },
  };
}

export default function Home() {
  const y = currentYear();
  const count = getHolidays(y).length;
  return (
    <main>
      <TodayHero />
      <section className="seo-body">
        <h1 className="title" data-reveal>Festivos en Colombia {y}</h1>
        <p className="lead" data-reveal>
          En {y}, Colombia tiene <b>{count} días festivos</b> de carácter nacional. La mayoría
          se traslada al lunes siguiente por la Ley Emiliani, lo que genera los puentes festivos.
          Esta es la lista completa con sus fechas exactas.
        </p>
        <HolidayTable year={y} />
        <p className="muted" data-reveal>
          Todas las fechas se calculan con la Ley 51 de 1983 (Ley Emiliani) y la Ley 2578 de 2026.
          ¿Buscas otro año? Revisa los <a href={`/festivos/${y + 1}`}>festivos {y + 1}</a> o el
          listado completo al pie de la página.
        </p>
      </section>
      <JsonLd year={y} />
    </main>
  );
}
