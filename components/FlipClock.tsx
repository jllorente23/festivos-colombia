"use client";

import { useEffect, useState } from "react";
import { SplitFlap, Presets } from "react-split-flap";

export type ClockTime = { hours: string; minutes: string; seconds: string; period: string };

const PERIOD_CHARS = ["AM", "PM"];

function useSiteTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const read = () => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return theme;
}

export default function FlipClock({
  time,
  isFestivo = false,
}: {
  time: ClockTime;
  isFestivo?: boolean;
}) {
  const theme = useSiteTheme();
  const flapTheme = theme === "dark" ? "dark" : "light";
  const fontColor = isFestivo ? "var(--red)" : "var(--ink)";
  const background = theme === "dark"
    ? "linear-gradient(184deg, #2A1E12 0%, #1F150C 25%)"
    : "linear-gradient(145deg, #FFF8EE 0%, #FFE5BF 100%)";

  const flapProps = {
    chars: Presets.NUM,
    length: 2 as const,
    timing: 32,
    hinge: true,
    theme: flapTheme as "light" | "dark",
    size: "large" as const,
    fontColor,
    background,
    padMode: "start" as const,
    padChar: "0",
  };

  return (
    <div
      className="flip-clock"
      aria-live="polite"
      aria-label={`Hora en Colombia: ${time.hours}:${time.minutes}:${time.seconds} ${time.period}`}
    >
      <SplitFlap value={time.hours} {...flapProps} />
      <span className="flip-clock-sep" aria-hidden="true">:</span>
      <SplitFlap value={time.minutes} {...flapProps} />
      <span className="flip-clock-sep" aria-hidden="true">:</span>
      <SplitFlap value={time.seconds} {...flapProps} />
      <SplitFlap
        value={time.period}
        chars={PERIOD_CHARS}
        length={1}
        timing={48}
        hinge
        theme={flapTheme}
        size="large"
        fontColor={fontColor}
        background={background}
      />
    </div>
  );
}
