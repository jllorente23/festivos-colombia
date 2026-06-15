import { getHolidays, MONTHS, DOW } from "@/lib/holidays";

export default function HolidayTable({ year }: { year: number }) {
  const hs = getHolidays(year);
  return (
    <table className="holiday-table">
      <caption>Calendario de festivos {year}</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Día</th>
          <th scope="col">Festivo</th>
        </tr>
      </thead>
      <tbody>
        {hs.map((h, i) => (
          <tr key={i}>
            <td className="ht-date">{h.date.getDate()} {MONTHS[h.date.getMonth()]}</td>
            <td className="ht-dow">{DOW[h.date.getDay()]}</td>
            <td className="ht-name">
              {h.name}
              {h.wasMoved && <span className="ht-moved"> · trasladado al lunes</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
