'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type Locale = 'en' | 'ar';

interface LocaleState {
  locale: Locale;
  direction: 'ltr' | 'rtl';
  isArabic: boolean;
}

export function useLocale() {
  const router = useRouter();
  const pathname = usePathname();
  const [localeState, setLocaleState] = useState<LocaleState>({
    locale: 'en',
    direction: 'ltr',
    isArabic: false,
  });

  useEffect(() => {
    // Detect locale from pathname or localStorage
    const detectedLocale = detectLocale();
    updateLocale(detectedLocale);
  }, [pathname]);

  const detectLocale = (): Locale => {
    // Check URL first
    if (pathname?.startsWith('/ar')) return 'ar';
    
    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('locale') as Locale;
      if (stored && ['en', 'ar'].includes(stored)) {
        return stored;
      }
    }
    
    // Check browser language
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language;
      if (browserLang.startsWith('ar')) return 'ar';
    }
    
    return 'en';
  };

  const updateLocale = (locale: Locale) => {
    const isArabic = locale === 'ar';
    const newState: LocaleState = {
      locale,
      direction: isArabic ? 'rtl' : 'ltr',
      isArabic,
    };
    
    setLocaleState(newState);
    
    // Update HTML attributes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = newState.direction;
      document.body.className = isArabic ? 'font-arabic' : '';
    }
    
    // Store preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  };

  const switchLocale = (locale: Locale) => {
    updateLocale(locale);
    
    // Update URL if needed
    if (pathname) {
      const currentLocale = pathname.split('/')[1] as Locale;
      if (currentLocale !== locale) {
        const newPath = locale === 'en' 
          ? pathname.replace('/ar', '') || '/'
          : `/ar${pathname}`;
        router.push(newPath);
      }
    }
  };

  const t = (key: string, fallback?: string): string => {
    // This would typically use a translation library
    // For now, return the key or fallback
    return fallback || key;
  };

  const formatDate = (date: Date | string, showHijri: boolean = false): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (localeState.isArabic) {
      // Arabic date formatting
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      
      if (showHijri) {
        // This would use Hijri calendar in a real implementation
        return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(dateObj);
      }
      
      return new Intl.DateTimeFormat('ar-SA', options).format(dateObj);
    }
    
    // English date formatting
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    if (showHijri) {
      // This would use Hijri calendar in a real implementation
      return new Intl.DateTimeFormat('en-US-u-ca-islamic', options).format(dateObj);
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(localeState.locale).format(num);
  };

  const formatRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return localeState.isArabic ? 'الآن' : 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return localeState.isArabic 
        ? `منذ ${diffInMinutes} دقيقة`
        : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return localeState.isArabic
        ? `منذ ${diffInHours} ساعة`
        : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return localeState.isArabic
        ? `منذ ${diffInDays} يوم`
        : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    return formatDate(dateObj);
  };

  return {
    ...localeState,
    switchLocale,
    t,
    formatDate,
    formatNumber,
    formatRelativeTime,
  };
}