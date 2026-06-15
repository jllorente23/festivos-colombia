// Motor de festivos de Colombia. Todo se calcula por algoritmo, sin base de datos ni API.
// Fuentes legales: Ley 51 de 1983 (Ley Emiliani) y Ley 2578 de 2026 (Virgen de Chiquinquirá).

export type Holiday = {
  date: Date;
  name: string;
  why: string;
  moved: boolean;
  wasMoved: boolean;
};

export type Special = { date: Date; name: string; why: string };

export const DOW = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const DOW_SHORT = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

// Domingo de Pascua (Computus gregoriano)
export function easter(year: number): Date {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Traslada al lunes siguiente (Ley Emiliani). Si ya es lunes, no se mueve.
export function toMonday(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const add = (8 - d.getDay()) % 7;
  d.setDate(d.getDate() + add);
  return d;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + n);
  return d;
}

// Enésimo día de la semana del mes (weekday: 0 domingo .. 6 sábado)
export function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month, 1);
  const offset = (7 + weekday - first.getDay()) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

export function getHolidays(year: number): Holiday[] {
  const p = easter(year);
  const list: Holiday[] = [
    { date: new Date(year, 0, 1), name: "Año Nuevo", why: "Inicio del año.", moved: false, wasMoved: false },
    { date: new Date(year, 0, 6), name: "Día de los Reyes Magos", why: "Conmemora la llegada de los Reyes Magos al pesebre.", moved: true, wasMoved: false },
    { date: new Date(year, 2, 19), name: "Día de San José", why: "Honra a San José, esposo de la Virgen María.", moved: true, wasMoved: false },
    { date: addDays(p, -3), name: "Jueves Santo", why: "Semana Santa: recuerda la última cena.", moved: false, wasMoved: false },
    { date: addDays(p, -2), name: "Viernes Santo", why: "Semana Santa: recuerda la crucifixión de Jesús.", moved: false, wasMoved: false },
    { date: new Date(year, 4, 1), name: "Día del Trabajo", why: "Día internacional de los trabajadores.", moved: false, wasMoved: false },
    { date: addDays(p, 39), name: "Ascensión del Señor", why: "Conmemora la ascensión de Jesús al cielo.", moved: true, wasMoved: false },
    { date: addDays(p, 60), name: "Corpus Christi", why: "Celebra la presencia de Cristo en la eucaristía.", moved: true, wasMoved: false },
    { date: addDays(p, 68), name: "Sagrado Corazón de Jesús", why: "Devoción al Sagrado Corazón de Jesús.", moved: true, wasMoved: false },
    { date: new Date(year, 5, 29), name: "San Pedro y San Pablo", why: "Honra a los apóstoles Pedro y Pablo.", moved: true, wasMoved: false },
    { date: new Date(year, 6, 20), name: "Día de la Independencia", why: "Grito de independencia de Colombia, 1810.", moved: false, wasMoved: false },
    { date: new Date(year, 7, 7), name: "Batalla de Boyacá", why: "Batalla decisiva de la independencia, 1819.", moved: false, wasMoved: false },
    { date: new Date(year, 7, 15), name: "Asunción de la Virgen", why: "Conmemora la asunción de la Virgen María.", moved: true, wasMoved: false },
    { date: new Date(year, 9, 12), name: "Día de la Diversidad Étnica y Cultural", why: "Antes Día de la Raza: recuerda el encuentro de culturas.", moved: true, wasMoved: false },
    { date: new Date(year, 10, 1), name: "Día de Todos los Santos", why: "Honra a todos los santos.", moved: true, wasMoved: false },
    { date: new Date(year, 10, 11), name: "Independencia de Cartagena", why: "Independencia de Cartagena, 1811.", moved: true, wasMoved: false },
    { date: new Date(year, 11, 8), name: "Inmaculada Concepción", why: "Dogma de la Inmaculada Concepción de María.", moved: false, wasMoved: false },
    { date: new Date(year, 11, 25), name: "Navidad", why: "Celebra el nacimiento de Jesús.", moved: false, wasMoved: false },
  ];

  // Festivo creado por la Ley 2578 del 1 de junio de 2026. Aplica desde 2026 y se rige por la Ley Emiliani.
  if (year >= 2026) {
    list.push({ date: new Date(year, 6, 9), name: "Virgen del Rosario de Chiquinquirá", why: "Honra a la patrona de Colombia. Festivo nacional creado por la Ley 2578 de 2026.", moved: true, wasMoved: false });
  }

  for (const h of list) {
    if (h.moved) {
      const m = toMonday(h.date);
      h.wasMoved = m.getTime() !== h.date.getTime();
      h.date = m;
    }
  }
  list.sort((a, b) => a.date.getTime() - b.date.getTime());
  return list;
}

// Fechas especiales de Colombia que no son festivos (no hay descanso)
export function getSpecials(year: number): Special[] {
  const p = easter(year);
  return [
    { date: addDays(p, -7), name: "Domingo de Ramos", why: "Inicio de la Semana Santa: entrada de Jesús a Jerusalén." },
    { date: new Date(p.getFullYear(), p.getMonth(), p.getDate()), name: "Domingo de Resurrección", why: "Domingo de Pascua: cierre de la Semana Santa." },
    { date: nthWeekday(year, 4, 0, 2), name: "Día de la Madre", why: "Se celebra el segundo domingo de mayo." },
    { date: nthWeekday(year, 5, 0, 3), name: "Día del Padre", why: "Se celebra el tercer domingo de junio." },
    { date: nthWeekday(year, 8, 6, 3), name: "Día del Amor y la Amistad", why: "Se celebra el tercer sábado de septiembre." },
    { date: new Date(year, 11, 7), name: "Día de las Velitas", why: "Víspera de la Inmaculada. Se encienden velas y faroles, inicia la temporada navideña." },
    { date: new Date(year, 11, 24), name: "Nochebuena", why: "La gran celebración navideña en Colombia. La Navidad, que es festivo, es el 25." },
    { date: new Date(year, 11, 31), name: "Fin de Año", why: "Despedida del año (Año Viejo). El Año Nuevo, que es festivo, es el 1 de enero." },
  ];
}

// Temporadas festivas que se resaltan con banda, aunque el festivo sea el día siguiente
export function getBands(year: number): [number, number][] {
  const p = easter(year);
  return [
    [addDays(p, -7).getTime(), new Date(year, p.getMonth(), p.getDate()).getTime()], // Semana Santa
    [new Date(year, 11, 7).getTime(), new Date(year, 11, 8).getTime()], // Velitas e Inmaculada
    [new Date(year, 11, 24).getTime(), new Date(year, 11, 25).getTime()], // Nochebuena y Navidad
    [new Date(year, 11, 31).getTime(), new Date(year, 11, 31).getTime()], // Fin de Año
  ];
}

export function inBand(t: number, bands: [number, number][]): boolean {
  return bands.some(([a, b]) => t >= a && t <= b);
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

export function isoDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Hoy según la zona horaria de Colombia, independientemente de dónde esté el visitante
export function todayInBogota(): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
}

export function currentYear(): number {
  return todayInBogota().getFullYear();
}

// Ventana de años que se pre-generan en el build. Otros años se renderizan bajo demanda.
export function yearWindow(): number[] {
  const c = currentYear();
  const years: number[] = [];
  for (let y = c - 3; y <= c + 10; y++) years.push(y);
  return years;
}
