// Единая утилита работы с датами.
// Реальные форматы инпутов (проверено по приложению):
//   - type="text"  -> "дд-мм-гггг" (DD-MM-YYYY): договор, проект, куратор
//   - type="date"  -> "YYYY-MM-DD": сертификация
const pad = (n: number): string => String(n).padStart(2, '0');

/** dd-mm-yyyy для текстовых дат-инпутов (договор/проект/куратор). */
export const formatDmy = (date: Date): string =>
  `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

/** Разбирает текстовую дату «дд-мм-гггг» (DD-MM-YYYY) в Date. Обратна к formatDmy. */
export const parseDmy = (value: string): Date => {
  const [day, month, year] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** yyyy-mm-dd для нативных date-инпутов (сертификация). */
export const formatYmd = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const today = (): Date => new Date();

export const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const addYears = (date: Date, years: number): Date => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/** Случайная дата в диапазоне [from, to] включительно. */
export const randomDate = (from: Date, to: Date): Date => {
  const ms = from.getTime() + Math.random() * (to.getTime() - from.getTime());
  return new Date(ms);
};

/**
 * Возвращает две разные даты в диапазоне [from, to], где start < stop.
 * Если случайные start и stop совпали (узкий диапазон) — stop сдвигается на следующий день.
 */
export const pickOrderedRange = (from: Date, to: Date): { start: Date; stop: Date } => {
  const start = randomDate(from, to);
  let stop = randomDate(start, to);

  if (stop.getTime() <= start.getTime()) {
    stop = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  }

  return { start, stop };
};
