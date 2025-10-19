import { format } from 'date-fns';
import { format as formatHijri, toHijri } from 'date-fns-hijri';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Riyadh';

export function formatDate(
  date: string | Date,
  showHijri: boolean = false,
  locale: 'en' | 'ar' = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const zonedDate = utcToZonedTime(dateObj, TIMEZONE);

  if (showHijri) {
    try {
      const hijriDate = toHijri(zonedDate);
      const hijriFormatted = formatHijri(hijriDate, 'dd MMMM yyyy', { locale: 'ar' });
      const gregorianFormatted = format(zonedDate, 'dd MMM yyyy', { locale });
      
      return locale === 'ar' 
        ? `${hijriFormatted} (${gregorianFormatted})`
        : `${gregorianFormatted} (${hijriFormatted})`;
    } catch (error) {
      // Fallback to Gregorian if Hijri conversion fails
      return format(zonedDate, 'dd MMM yyyy', { locale });
    }
  }

  return format(zonedDate, 'dd MMM yyyy', { locale });
}

export function formatDateTime(
  date: string | Date,
  showHijri: boolean = false,
  locale: 'en' | 'ar' = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const zonedDate = utcToZonedTime(dateObj, TIMEZONE);

  if (showHijri) {
    try {
      const hijriDate = toHijri(zonedDate);
      const hijriFormatted = formatHijri(hijriDate, 'dd MMMM yyyy HH:mm', { locale: 'ar' });
      const gregorianFormatted = format(zonedDate, 'dd MMM yyyy HH:mm', { locale });
      
      return locale === 'ar' 
        ? `${hijriFormatted} (${gregorianFormatted})`
        : `${gregorianFormatted} (${hijriFormatted})`;
    } catch (error) {
      return format(zonedDate, 'dd MMM yyyy HH:mm', { locale });
    }
  }

  return format(zonedDate, 'dd MMM yyyy HH:mm', { locale });
}

export function formatRelativeTime(
  date: string | Date,
  locale: 'en' | 'ar' = 'en'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const zonedDate = utcToZonedTime(dateObj, TIMEZONE);
  const now = utcToZonedTime(new Date(), TIMEZONE);
  const diffInSeconds = Math.floor((now.getTime() - zonedDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return locale === 'ar' ? 'الآن' : 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return locale === 'ar' 
      ? `منذ ${diffInMinutes} دقيقة`
      : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return locale === 'ar'
      ? `منذ ${diffInHours} ساعة`
      : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return locale === 'ar'
      ? `منذ ${diffInDays} يوم`
      : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return locale === 'ar'
      ? `منذ ${diffInWeeks} أسبوع`
      : `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  return formatDate(zonedDate, false, locale);
}

export function getWeekRange(weekNumber: number, startDate: Date): {
  start: Date;
  end: Date;
} {
  const start = new Date(startDate);
  start.setDate(start.getDate() + (weekNumber - 1) * 7);
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  
  return { start, end };
}

export function isDateInRange(date: string | Date, startDate: string | Date, endDate: string | Date): boolean {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return checkDate >= start && checkDate <= end;
}

export function getCurrentWeekNumber(programStartDate: Date): number {
  const now = utcToZonedTime(new Date(), TIMEZONE);
  const start = utcToZonedTime(programStartDate, TIMEZONE);
  
  const diffInDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(diffInDays / 7) + 1;
}