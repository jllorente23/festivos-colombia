"use client";

import { useState } from "react";
import CalendarModal from "./CalendarModal";

export default function YearCalendarButton({ year }: { year: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cta-row">
      <button className="cta" onClick={() => setOpen(true)}>
        Ver calendario {year}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <CalendarModal initialYear={year} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
