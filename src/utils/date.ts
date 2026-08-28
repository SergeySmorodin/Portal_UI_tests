// Единая утилита работы с датами.
// Реальные форматы инпутов (проверено по приложению):
//   - type="text"  -> "дд-мм-гггг" (DD-MM-YYYY): договор, проект, куратор
//   - type="date"  -> "YYYY-MM-DD": сертификация
const pad = (n: number): string => String(n).padStart(2, '0');

/** dd-mm-yyyy для текстовых дат-инпутов (договор/проект/куратор). */
export const formatDmy = (date: Date): string =>
  `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;

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
