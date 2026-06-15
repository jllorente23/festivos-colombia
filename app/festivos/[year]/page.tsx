import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HolidayTable from "@/components/HolidayTable";
import JsonLd from "@/components/JsonLd";
import YearNav from "@/components/YearNav";
import YearCalendarButton from "@/components/YearCalendarButton";
import { getHolidays, yearWindow, MONTHS } from "@/lib/holidays";

export function generateStaticParams() {
  return yearWindow().map((y) => ({ year: String(y) }));
}

function parseYear(s: string): number | null {
  const y = Number(s);
  if (!Number.isInteger(y) || y < 1900 || y > 2200) return null;
  return y;
}

export function generateMetadata({ params }: { params: { year: string } }): Metadata {
  const y = parseYear(params.year);
  if (!y) return {};
  const count = getHolidays(y).length;
  return {
    title: `Festivos en Colombia ${y}: calendario completo y puentes`,
    description: `Los ${count} días festivos de Colombia en ${y} con fechas exactas, puentes, Semana Santa y la Ley Emiliani.`,
    alternates: { canonical: `/festivos/${y}` },
  };
}

export default function YearPage({ params }: { params: { year: string } }) {
  const y = parseYear(params.year);
  if (!y) notFound();

  const hs = getHolidays(y);
  const first = hs[0];
  const sample = hs.slice(0, 3).map((h) => `${h.date.getDate()} de ${MONTHS[h.date.getMonth()]}`).join(", ");

  return (
    <main className="page">
      <p className="eyebrow-link">
        <a href="/" className="back-today">← Llévame al día de hoy</a>
      </p>
      <h1 className="title">Festivos en Colombia {y}</h1>
      <p className="lead">
        En {y}, Colombia tiene <b>{hs.length} días festivos</b> de carácter nacional. El primero
        es {first.name}, el {first.date.getDate()} de {MONTHS[first.date.getMonth()]}. Entre los
        más cercanos al inicio del año están: {sample}. La mayoría se traslada al lunes por la
        Ley Emiliani, formando los puentes festivos.
      </p>

      <YearCalendarButton year={y} />
      <HolidayTable year={y} />
      <YearNav year={y} />

      <p className="muted">
        Fechas calculadas con la Ley 51 de 1983 (Ley Emiliani) y la Ley 2578 de 2026 (Día de la
        Virgen del Rosario de Chiquinquirá). Los festivos de Semana Santa dependen de la fecha de
        Pascua de cada año.
      </p>

      <JsonLd year={y} />
    </main>
  );
}
