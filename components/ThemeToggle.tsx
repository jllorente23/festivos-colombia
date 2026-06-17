"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

function getTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(dark: boolean) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem("theme", dark ? "dark" : "light");
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

async function toggleThemeWithAnimation(
  button: HTMLButtonElement,
  setDark: (dark: boolean) => void,
  isDark: boolean,
) {
  const next = !isDark;
  const doc = document as ViewTransitionDocument;

  if (
    !doc.startViewTransition
    || window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setDark(next);
    applyTheme(next);
    return;
  }

  const { top, left, width, height } = button.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = doc.startViewTransition(() => {
    flushSync(() => {
      setDark(next);
      applyTheme(next);
    });
  });

  await transition.ready;

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 650,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)",
    },
  );
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsDark(getTheme() === "dark");
  }, []);

  const toggle = async () => {
    if (!buttonRef.current) return;
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 550);
    await toggleThemeWithAnimation(buttonRef.current, setIsDark, isDark);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`theme-toggle${isAnimating ? " is-animating" : ""}`}
      data-dark={isDark ? "true" : "false"}
      onClick={toggle}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={isDark}
    >
      <span className="theme-toggle-icons" aria-hidden="true">
        <svg className="theme-icon theme-icon-moon" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <svg className="theme-icon theme-icon-sun" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="theme-toggle-thumb" aria-hidden="true" />
    </button>
  );
}
