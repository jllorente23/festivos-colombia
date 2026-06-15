export default function YearNav({ year }: { year: number }) {
  return (
    <nav className="yearnav" aria-label="Otros años">
      <a href={`/festivos/${year - 1}`}>&larr; Festivos <b>{year - 1}</b></a>
      <a href={`/festivos/${year + 1}`}>Festivos <b>{year + 1}</b> &rarr;</a>
    </nav>
  );
}
