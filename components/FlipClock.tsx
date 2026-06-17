"use client";

import { useEffect, useState } from "react";

export type ClockTime = { hours: string; minutes: string; seconds: string; period: string };

function FlipDigit({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value === shown) return;
    setPrev(shown);
    setFlipping(true);
    const id = window.setTimeout(() => {
      setShown(value);
      setFlipping(false);
    }, 420);
    return () => window.clearTimeout(id);
  }, [value, shown]);

  return (
    <span className={`flip-digit${flipping ? " is-flipping" : ""}`} aria-hidden="true">
      <span className="flip-digit-stack">
        <span className="flip-digit-half flip-digit-top">
          <span>{shown}</span>
        </span>
        <span className="flip-digit-half flip-digit-bottom">
          <span>{shown}</span>
        </span>
        {flipping && (
          <>
            <span className="flip-digit-half flip-digit-top flip-digit-leaf">
              <span>{prev}</span>
            </span>
            <span className="flip-digit-half flip-digit-bottom flip-digit-leaf flip-digit-leaf-in">
              <span>{value}</span>
            </span>
          </>
        )}
        <span className="flip-digit-hinge" />
      </span>
    </span>
  );
}

function FlipPair({ value }: { value: string }) {
  return (
    <>
      <FlipDigit value={value[0] ?? "0"} />
      <FlipDigit value={value[1] ?? "0"} />
    </>
  );
}

export default function FlipClock({
  time,
}: {
  time: ClockTime;
  isFestivo?: boolean;
}) {
  return (
    <div
      className="countdown-units live-clock-units"
      aria-live="polite"
      aria-label={`Hora en Colombia: ${time.hours}:${time.minutes}:${time.seconds} ${time.period}`}
    >
      <FlipPair value={time.hours} />
      <span className="countdown-sep" aria-hidden="true">:</span>
      <FlipPair value={time.minutes} />
      <span className="countdown-sep" aria-hidden="true">:</span>
      <FlipPair value={time.seconds} />
      <span className="live-clock-ampm">{time.period}</span>
    </div>
  );
}
