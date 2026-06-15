"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getHolidays, getSpecials, getBands, inBand, dateKey, isSameDay,
  todayInBogota, DOW, DOW_SHORT, MONTHS,
} from "@/lib/holidays";

type Tip = { x: number; y: number; title: string; body: string; meta: string } | null;

export default function CalendarModal({
  initialYear, open, onClose,
}: { initialYear: number; open: boolean; onClose: () => void }) {
  const [viewYear, setViewYear] = useState(initialYear);
  const [tip, setTip] = useState<Tip>(null);

  useEffect(() => { if (open) setViewYear(initialYear); }, [open, initialYear]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") { setViewYear((y) => y - 1); setTip(null); }
      else if (e.key === "ArrowRight") { setViewYear((y) => y + 1); setTip(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const { holMap, espMap, bands, holCount } = useMemo(() => {
    const hs = getHolidays(viewYear);
    const es = getSpecials(viewYear);
    const hm: Record<string, (typeof hs)[number]> = {};
    hs.forEach((h) => (hm[dateKey(h.date)] = h));
    const em: Record<string, (typeof es)[number]> = {};
    es.forEach((e) => (em[dateKey(e.date)] = e));
    return { holMap: hm, espMap: em, bands: getBands(viewYear), holCount: hs.length };
  }, [viewYear]);

  const today = useMemo(() => todayInBogota(), []);

  if (!open) return null;

  const showTip = (el: HTMLElement, title: string, body: string, meta: string) => {
    const r = el.getBoundingClientRect();
    setTip({ x: r.left + r.width / 2, y: r.top, title, body, meta });
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={`Calendario ${viewYear}`}>
      <div className="ov-head">
        <div className="year-stepper">
          <button onClick={() => { setViewYear((y) => y - 1); setTip(null); }} aria-label="Año anterior">&larr;</button>
          <div className="yv">{viewYear}</div>
          <button onClick={() => { setViewYear((y) => y + 1); setTip(null); }} aria-label="Año siguiente">&rarr;</button>
        </div>
        <div className="ov-meta">{holCount} festivos</div>
        <button className="ov-close" onClick={onClose} aria-label="Cerrar calendario">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="ov-legend">
        <span><i className="lg-red" /> Festivo</span>
        <span><i className="lg-gold" /> Fecha especial</span>
        <span><i className="lg-band" /> Temporada festiva</span>
      </div>

      <div className="months" onScroll={() => setTip(null)}>
        {MONTHS.map((monthName, mo) => {
          const first = new Date(viewYear, mo, 1);
          const startGap = (first.getDay() + 6) % 7; // lunes primero
          const total = new Date(viewYear, mo + 1, 0).getDate();
          const cells: React.ReactNode[] = [];
          for (let g = 0; g < startGap; g++) cells.push(<div key={`e${g}`} className="cell empty" />);
          for (let dnum = 1; dnum <= total; dnum++) {
            const cur = new Date(viewYear, mo, dnum);
            const t = cur.getTime();
            const hol = holMap[dateKey(cur)];
            const esp = espMap[dateKey(cur)];
            const classes = ["cell"];
            if (inBand(t, bands)) classes.push("celebra");
            if (isSameDay(cur, today)) classes.push("today");
            if (hol) classes.push("holiday");
            else if (esp) classes.push("special");

            const interactive = hol || esp;
            const handler = () => {
              const el = document.getElementById(`c-${mo}-${dnum}`)!;
              if (hol) {
                const meta = (hol.wasMoved ? "Trasladado al lunes" : "Festivo fijo");
                showTip(el, hol.name, hol.why, `${DOW[hol.date.getDay()]} ${hol.date.getDate()} de ${MONTHS[hol.date.getMonth()]} · ${meta}`);
              } else if (esp) {
                showTip(el, esp.name, esp.why, `${DOW[esp.date.getDay()]} ${esp.date.getDate()} de ${MONTHS[esp.date.getMonth()]} · No es festivo`);
              }
            };

            cells.push(
              <div
                key={dnum}
                id={`c-${mo}-${dnum}`}
                className={classes.join(" ")}
                tabIndex={interactive ? 0 : undefined}
                role={interactive ? "button" : undefined}
                onClick={interactive ? handler : undefined}
                onFocus={interactive ? handler : undefined}
              >
                {dnum}
              </div>
            );
          }
          return (
            <div key={mo} className="month">
              <h4>{monthName}</h4>
              <div className="dow">{DOW_SHORT.map((s) => <span key={s}>{s}</span>)}</div>
              <div className="days">{cells}</div>
            </div>
          );
        })}
      </div>

      {tip && (
        <div
          className="tooltip"
          style={{
            left: Math.max(12, Math.min(tip.x - 125, (typeof window !== "undefined" ? window.innerWidth : 360) - 262)),
            top: Math.max(12, tip.y - 86),
          }}
        >
          <strong>{tip.title}</strong>
          {tip.body}
          <em>{tip.meta}</em>
        </div>
      )}
    </div>
  );
}
