'use client';

import { useLocale } from '@/lib/hooks/useLocale';
import { cn } from '@/lib/utils';

export function Footer() {
  const { isArabic, direction } = useLocale();

  return (
    <footer className={cn(
      "bg-white border-t border-gray-200 mt-auto",
      direction === 'rtl' && 'rtl'
    )}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-600 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} {isArabic ? 'أكاديمية أكسنتشر' : 'Accenture Academy'}. 
              {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end space-x-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isArabic ? 'الخصوصية' : 'Privacy'}
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isArabic ? 'الشروط' : 'Terms'}
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isArabic ? 'المساعدة' : 'Help'}
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isArabic ? 'اتصل بنا' : 'Contact'}
            </a>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-xs text-gray-500 text-center md:text-left">
              {isArabic ? 'مبني باستخدام' : 'Built with'} Next.js, Supabase, TailwindCSS
            </div>
            <div className="text-xs text-gray-500">
              {isArabic ? 'الإصدار' : 'Version'} 1.0.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}