import { getHolidays, MONTHS, DOW, todayInBogota, isSameDay } from "@/lib/holidays";

export default function HolidayTable({ year }: { year: number }) {
  const hs = getHolidays(year);
  const today = todayInBogota();
  const highlightToday = today.getFullYear() === year;

  return (
    <div className="holiday-table-wrap">
      <div className="holiday-table" role="table">
        <div className="holiday-table-caption" role="caption">
          Calendario de festivos {year}
        </div>

        <div role="rowgroup" className="holiday-table-head">
          <div role="row" className="holiday-table-row holiday-table-row--head">
            <div role="columnheader">Fecha</div>
            <div role="columnheader">Día</div>
            <div role="columnheader">Festivo</div>
          </div>
        </div>

        <div role="rowgroup" className="holiday-table-body">
          {hs.map((h, i) => {
            const isToday = highlightToday && isSameDay(h.date, today);
            return (
              <div
                key={i}
                role="row"
                className={`holiday-table-row${isToday ? " is-today" : ""}`}
              >
                {isToday && <div className="ht-today-band" aria-hidden="true" />}
                <div role="cell" className="ht-date">
                  {h.date.getDate()} {MONTHS[h.date.getMonth()]}
                </div>
                <div role="cell" className="ht-dow">
                  {DOW[h.date.getDay()]}
                </div>
                <div role="cell" className="ht-name">
                  <span className="ht-name-inner">
                    {h.name}
                    {h.wasMoved && <span className="ht-moved"> · trasladado al lunes</span>}
                  </span>
                  {isToday && <span className="ht-today-pill">Hoy</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
