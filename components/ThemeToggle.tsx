"use client";

import { useEffect, useState } from "react";

function getTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsDark(getTheme() === "dark");
  }, []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 550);
  };

  return (
    <button
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
