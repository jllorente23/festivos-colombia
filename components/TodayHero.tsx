"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getHolidays, getSpecials, dateKey, todayInBogota, DOW, MONTHS,
} from "@/lib/holidays";
import CalendarModal from "./CalendarModal";

export default function TodayHero() {
  const [today, setToday] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);

  useEffect(() => { setToday(todayInBogota()); }, []);

  const data = useMemo(() => {
    if (!today) return null;
    const year = today.getFullYear();
    const hs = getHolidays(year);
    const es = getSpecials(year);
    const holMap: Record<string, (typeof hs)[number]> = {};
    hs.forEach((h) => (holMap[dateKey(h.date)] = h));
    const espMap: Record<string, (typeof es)[number]> = {};
    es.forEach((e) => (espMap[dateKey(e.date)] = e));

    const todayHol = holMap[dateKey(today)] || null;
    const todayEsp = espMap[dateKey(today)] || null;

    let upcoming = hs.filter((h) => h.date.getTime() > today.getTime());
    if (upcoming.length < 4) upcoming = upcoming.concat(getHolidays(year + 1));
    upcoming = upcoming.slice(0, 4);

    let next = hs.find((h) => h.date.getTime() > today.getTime());
    if (!next) next = getHolidays(year + 1)[0];

    return { year, todayHol, todayEsp, upcoming, next };
  }, [today]);

  const calYear = today ? today.getFullYear() : new Date().getFullYear();
  const isFestivo = !!data?.todayHol;

  return (
    <section className="hero-section">
      <div className={`hero${isFestivo ? " is-festivo" : ""}`}>
        <div className="hero-date">
          <div className="eyebrow">
            <span className="dot" />
            <span>{today ? DOW[today.getDay()] : "\u00a0"}</span>
          </div>

          <div className="daywrap">
            <span className="day-number">{today ? today.getDate() : "\u00a0"}</span>
          </div>

          <div className="month-line">
            {today ? (
              <>de {MONTHS[today.getMonth()]} <span className="yr">{today.getFullYear()}</span></>
            ) : "\u00a0"}
          </div>

          {data && (
            <div className="status">
              {data.todayHol ? (
                <>
                  <span className="badge"><span className="pulse" />Hoy es festivo</span>
                  <h2 className="status-title">{data.todayHol.name}</h2>
                  <p className="status-sub">{data.todayHol.why}</p>
                  {data.todayHol.wasMoved && (
                    <p className="status-sub">Trasladado a este lunes por la Ley Emiliani.</p>
                  )}
                </>
              ) : (
                <>
                  <span className="badge"><span className="pulse" />Día laborable</span>
                  <h2 className="status-title">Hoy no es festivo</h2>
                  {data.todayEsp && (
                    <p className="esp-note">Hoy se celebra: <b>{data.todayEsp.name}</b></p>
                  )}
                </>
              )}
            </div>
          )}

          {data && !data.todayHol && (
            <div className="legend">
              <span>
                El próximo festivo será el{" "}
                <span className="hl">
                  {DOW[data.next.date.getDay()]} {data.next.date.getDate()} de {MONTHS[data.next.date.getMonth()]}
                  {data.next.date.getFullYear() !== data.year ? ` de ${data.next.date.getFullYear()}` : ""}
                </span>{" "}
                · {data.next.name}
              </span>
            </div>
          )}

          <button className="cta" onClick={() => setCalOpen(true)}>
            Ver calendario
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {data && (
          <div className="upcoming">
            <h3>Próximos festivos</h3>
            <div>
              {data.upcoming.map((h, i) => (
                <div className="uprow" key={i}>
                  <div className="d">
                    {h.date.getDate()}<span className="mo">{MONTHS[h.date.getMonth()].slice(0, 3)}</span>
                  </div>
                  <div className="n">
                    {h.name}
                    <small>
                      {DOW[h.date.getDay()]}
                      {h.date.getFullYear() !== data.year ? ` · ${h.date.getFullYear()}` : ""}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CalendarModal initialYear={calYear} open={calOpen} onClose={() => setCalOpen(false)} />
    </section>
  );
}
