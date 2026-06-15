"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getHolidays, getSpecials, getBands, inBand, dateKey, isSameDay,
  todayInBogota, DOW, DOW_SHORT, MONTHS,
} from "@/lib/holidays";

type TipData = {
  cellId: string;
  anchorX: number;
  anchorTop: number;
  anchorBottom: number;
  title: string;
  body: string;
  meta: string;
};

type PopoverPos = {
  left: number;
  top: number;
  arrowX: number;
  placement: "above" | "below";
};

function DatePopover({ tip, onClose }: { tip: TipData; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<PopoverPos | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const box = el.getBoundingClientRect();
      const pad = 14;
      const gap = 10;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = tip.anchorX - box.width / 2;
      left = Math.max(pad, Math.min(left, vw - box.width - pad));

      const arrowX = tip.anchorX - left;
      const spaceAbove = tip.anchorTop - pad;
      const spaceBelow = vh - tip.anchorBottom - pad;
      const placement: "above" | "below" =
        spaceAbove >= box.height + gap || spaceAbove > spaceBelow ? "above" : "below";

      let top = placement === "above"
        ? tip.anchorTop - box.height - gap
        : tip.anchorBottom + gap;
      top = Math.max(pad, Math.min(top, vh - box.height - pad));

      setPos({ left, top, arrowX, placement });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [tip]);

  return (
    <div
      ref={ref}
      className="date-popover"
      role="dialog"
      aria-label={tip.title}
      style={pos ? { left: pos.left, top: pos.top, visibility: "visible" } : { visibility: "hidden" }}
    >
      <button type="button" className="date-popover-close" onClick={onClose} aria-label="Cerrar detalle">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <strong>{tip.title}</strong>
      <p>{tip.body}</p>
      <em>{tip.meta}</em>
      {pos && (
        <span
          className="date-popover-arrow"
          style={{ left: pos.arrowX }}
          data-placement={pos.placement}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default function CalendarModal({
  initialYear, open, onClose,
}: { initialYear: number; open: boolean; onClose: () => void }) {
  const [viewYear, setViewYear] = useState(initialYear);
  const [tip, setTip] = useState<TipData | null>(null);

  useEffect(() => { if (open) setViewYear(initialYear); }, [open, initialYear]);
  useEffect(() => { if (!open) setTip(null); }, [open]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { documentElement: html, body } = document;

    html.classList.add("modal-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (tip) setTip(null);
        else onClose();
      } else if (e.key === "ArrowLeft") { setViewYear((y) => y - 1); setTip(null); }
      else if (e.key === "ArrowRight") { setViewYear((y) => y + 1); setTip(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.classList.remove("modal-open");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, tip]);

  useEffect(() => {
    if (!tip) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(".date-popover")) return;
      if (t.closest(".cell.holiday, .cell.special")) return;
      setTip(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [tip]);

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

  const openTip = (cellId: string, el: HTMLElement, title: string, body: string, meta: string) => {
    if (tip?.cellId === cellId) {
      setTip(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTip({
      cellId,
      anchorX: r.left + r.width / 2,
      anchorTop: r.top,
      anchorBottom: r.bottom,
      title,
      body,
      meta,
    });
  };

  if (!open) return null;

  return createPortal(
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

      <div
        className="months"
        onScroll={() => {
          if (!tip) return;
          const el = document.getElementById(tip.cellId);
          if (!el) { setTip(null); return; }
          const r = el.getBoundingClientRect();
          setTip((prev) => prev ? {
            ...prev,
            anchorX: r.left + r.width / 2,
            anchorTop: r.top,
            anchorBottom: r.bottom,
          } : null);
        }}
      >
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
            const cellId = `c-${mo}-${dnum}`;
            const handler = () => {
              const el = document.getElementById(cellId)!;
              if (hol) {
                const meta = hol.wasMoved ? "Trasladado al lunes" : "Festivo fijo";
                openTip(
                  cellId,
                  el,
                  hol.name,
                  hol.why,
                  `${DOW[hol.date.getDay()]} ${hol.date.getDate()} de ${MONTHS[hol.date.getMonth()]} · ${meta}`,
                );
              } else if (esp) {
                openTip(
                  cellId,
                  el,
                  esp.name,
                  esp.why,
                  `${DOW[esp.date.getDay()]} ${esp.date.getDate()} de ${MONTHS[esp.date.getMonth()]} · No es festivo`,
                );
              }
            };

            cells.push(
              <div
                key={dnum}
                id={cellId}
                className={classes.join(" ")}
                data-active={tip?.cellId === cellId || undefined}
                tabIndex={interactive ? 0 : undefined}
                role={interactive ? "button" : undefined}
                onClick={interactive ? handler : undefined}
                onKeyDown={interactive ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handler();
                  }
                } : undefined}
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

      {tip && <DatePopover key={tip.cellId} tip={tip} onClose={() => setTip(null)} />}
    </div>,
    document.body,
  );
}
