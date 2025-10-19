// src/lib/utils/date.ts
// Dependency-free date helpers using Intl (with Asia/Riyadh) + Hijri toggle.

const TIMEZONE = 'Asia/Riyadh';

function toDate(d: string | number | Date): Date {
  return d instanceof Date ? d : new Date(d);
}

/** Gregorian formatter (e.g., "19 Oct 2025" or "19 Oct 2025, 08:30") */
function fmtGregorian(
  date: Date,
  locale: 'en' | 'ar' = 'en',
  withTime = false
): string {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  if (withTime) {
    opts.hour = '2-digit';
    opts.minute = '2-digit';
  }
  return new Intl.DateTimeFormat(locale, opts).format(date);
}

/** Hijri formatter (e.g., "26 ربيع الآخر 1447 هـ") */
function fmtHijri(
  date: Date,
  locale: 'en' | 'ar' = 'ar',
  withTime = false
): string {
  // "-u-ca-islamic" requests the Islamic calendar
  const hijriLocale = `${locale}-SA-u-ca-islamic`;
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  };
  if (withTime) {
    opts.hour = '2-digit';
    opts.minute = '2-digit';
  }
  return new Intl.DateTimeFormat(hijriLocale, opts).format(date);
}

/** Formats a date. If showHijri=true, returns "Hijri (Gregorian)" in AR or "Gregorian (Hijri)" in EN. */
export function formatDate(
  date: string | Date,
  showHijri = false,
  locale: 'en' | 'ar' = 'en'
): string {
  const d = toDate(date);

  if (showHijri) {
    const hijri = fmtHijri(d, 'ar', false);
    const greg = fmtGregorian(d, locale, false);
    return locale === 'ar' ? `${hijri} (${greg})` : `${greg} (${hijri})`;
  }
  return fmtGregorian(d, locale, false);
}

export function formatDateTime(
  date: string | Date,
  showHijri = false,
  locale: 'en' | 'ar' = 'en'
): string {
  const d = toDate(date);

  if (showHijri) {
    const hijri = fmtHijri(d, 'ar', true);
    const greg = fmtGregorian(d, locale, true);
    return locale === 'ar' ? `${hijri} (${greg})` : `${greg} (${hijri})`;
  }
  return fmtGregorian(d, locale, true);
}

/** "Just now" / "2 minutes ago" / Arabic equivalents */
export function formatRelativeTime(
  date: string | Date,
  locale: 'en' | 'ar' = 'en'
): string {
  const d = toDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return locale === 'ar' ? 'الآن' : 'Just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)
    return locale === 'ar'
      ? `منذ ${diffMin} دقيقة`
      : `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)
    return locale === 'ar'
      ? `منذ ${diffHr} ساعة`
      : `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7)
    return locale === 'ar'
      ? `منذ ${diffDay} يوم`
      : `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4)
    return locale === 'ar'
      ? `منذ ${diffWeek} أسبوع`
      : `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;

  // Fallback to absolute date
  return formatDate(d, false, locale);
}

/** Week helpers (unchanged) */
export function getWeekRange(
  weekNumber: number,
  startDate: Date
): { start: Date; end: Date } {
  const start = new Date(startDate);
  start.setDate(start.getDate() + (weekNumber - 1) * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export function isDateInRange(
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean {
  const checkDate = toDate(date);
  const start = toDate(startDate);
  const end = toDate(endDate);
  return checkDate >= start && checkDate <= end;
}

export function getCurrentWeekNumber(programStartDate: Date): number {
  const now = new Date();
  const start = new Date(programStartDate);
  const diffInDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(diffInDays / 7) + 1;
}
