// src/lib/hijri.ts
// Minimal helpers for Gregorian & Hijri formatting using the Intl API (no deps)

function toDate(d: string | number | Date): Date {
  return d instanceof Date ? d : new Date(d);
}

// e.g. "19 Oct 2025, 08:30"
export function formatGregorian(
  date: string | number | Date,
  locale: string = 'en'
): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

// e.g. "26 ربيع الآخر 1447 هـ"
export function formatHijri(
  date: string | number | Date,
  locale: string = 'ar'
): string {
  const d = toDate(date);
  // key: add "-u-ca-islamic" to request the Islamic calendar
  const hijriLocale = `${locale}-SA-u-ca-islamic`;
  return new Intl.DateTimeFormat(hijriLocale, {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(d);
}

// convenience toggle
export function formatByCalendar(
  date: string | number | Date,
  opts: { locale?: string; calendar?: 'gregory' | 'islamic' } = {}
): string {
  const { locale = 'en', calendar = 'gregory' } = opts;
  return calendar === 'islamic'
    ? formatHijri(date, locale.startsWith('ar') ? 'ar' : 'en')
    : formatGregorian(date, locale);
}
