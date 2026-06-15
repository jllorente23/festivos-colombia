"use client";

import { usePathname } from "next/navigation";
import { currentYear } from "@/lib/holidays";

export default function FooterYearLinks({ years }: { years: number[] }) {
  const pathname = usePathname();
  const match = pathname.match(/^\/festivos\/(\d{4})$/);
  const activeYear = match ? Number(match[1]) : pathname === "/" ? currentYear() : null;

  return (
    <nav className="year-links" aria-label="Festivos por año">
      {years.map((y) => (
        <a
          key={y}
          href={`/festivos/${y}`}
          className={y === activeYear ? "is-active" : undefined}
          aria-current={y === activeYear ? "page" : undefined}
        >
          {y}
        </a>
      ))}
    </nav>
  );
}
