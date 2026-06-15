import { currentYear } from "@/lib/holidays";

export default function NotFound() {
  const y = currentYear();
  return (
    <main className="page">
      <h1 className="title">Página no encontrada</h1>
      <p className="lead">No encontramos lo que buscabas. Revisa los festivos del año actual.</p>
      <nav className="yearnav">
        <a href="/">Inicio</a>
        <a href={`/festivos/${y}`}>Festivos <b>{y}</b></a>
      </nav>
    </main>
  );
}
