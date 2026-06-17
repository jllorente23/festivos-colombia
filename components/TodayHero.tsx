"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getHolidays, getSpecials, dateKey, todayInBogota, holidayStartBogotaMs, DOW, MONTHS,
} from "@/lib/holidays";
import CalendarModal from "./CalendarModal";

type Countdown = { days: number; hours: number; minutes: number; seconds: number };
type ClockTime = { hours: string; minutes: string; seconds: string; period: string };

function clockInBogota(now = new Date()): ClockTime {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Bogota",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).formatToParts(now).map((p) => [p.type, p.value]),
  );
  return {
    hours: parts.hour.padStart(2, "0"),
    minutes: parts.minute,
    seconds: parts.second,
    period: parts.dayPeriod.toUpperCase(),
  };
}

function splitCountdown(ms: number): Countdown {
  const total = Math.max(0, ms);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export default function TodayHero() {
  const [today, setToday] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [clock, setClock] = useState<ClockTime | null>(null);

  useEffect(() => { setToday(todayInBogota()); }, []);

  useEffect(() => {
    const tick = () => setClock(clockInBogota());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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

  useEffect(() => {
    if (!data?.next) return;
    const target = holidayStartBogotaMs(data.next.date);
    const tick = () => setCountdown(splitCountdown(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data?.next]);

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

          {clock && (
            <div className="live-clock">
              <div
                className="live-clock-face"
                aria-live="polite"
                aria-label={`Hora en Colombia: ${clock.hours}:${clock.minutes}:${clock.seconds} ${clock.period}`}
              >
                <div className="countdown-units live-clock-units">
                  <div className="countdown-unit">
                    <span>{clock.hours}</span>
                  </div>
                  <span className="countdown-sep" aria-hidden="true">:</span>
                  <div className="countdown-unit">
                    <span>{clock.minutes}</span>
                  </div>
                  <span className="countdown-sep" aria-hidden="true">:</span>
                  <div className="countdown-unit">
                    <span>{clock.seconds}</span>
                  </div>
                  <div className="countdown-unit live-clock-ampm">
                    <span>{clock.period}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data?.todayHol && (
            <div className="status">
              <span className="badge"><span className="pulse" />Hoy es festivo</span>
              <h2 className="status-title">{data.todayHol.name}</h2>
              <p className="status-sub">{data.todayHol.why}</p>
              {data.todayHol.wasMoved && (
                <p className="status-sub">Trasladado a este lunes por la Ley Emiliani.</p>
              )}
            </div>
          )}

          {data && !data.todayHol && data.todayEsp && (
            <p className="esp-note">Hoy se celebra: <b>{data.todayEsp.name}</b></p>
          )}

          <button className="cta" onClick={() => setCalOpen(true)}>
            Ver calendario
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {data && (
          <div className="upcoming">
            {countdown && (
              <div className="countdown">
                <p className="countdown-label">Tiempo para el siguiente festivo</p>
                <div className="countdown-units" aria-live="polite">
                  <div className="countdown-unit">
                    <span>{countdown.days}</span>
                    <small>días</small>
                  </div>
                  <span className="countdown-sep" aria-hidden="true">:</span>
                  <div className="countdown-unit">
                    <span>{pad2(countdown.hours)}</span>
                    <small>horas</small>
                  </div>
                  <span className="countdown-sep" aria-hidden="true">:</span>
                  <div className="countdown-unit">
                    <span>{pad2(countdown.minutes)}</span>
                    <small>min</small>
                  </div>
                  <span className="countdown-sep" aria-hidden="true">:</span>
                  <div className="countdown-unit">
                    <span>{pad2(countdown.seconds)}</span>
                    <small>seg</small>
                  </div>
                </div>
              </div>
            )}
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
