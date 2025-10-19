'use client';

import { useLocale } from '@/lib/hooks/useLocale';
import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewsPage() {
  const { isArabic, direction } = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h1 className={cn(
          "text-3xl font-bold text-gray-900 mb-4",
          direction === 'rtl' && 'text-right'
        )}>
          {isArabic ? 'الأخبار' : 'News'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isArabic 
            ? 'تابع أحدث الأخبار والمستجدات' 
            : 'Stay informed with the latest news and updates'}
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-purple-800">
            {isArabic 
              ? 'قريباً: نظام الأخبار مع المقالات والروابط الخارجية' 
              : 'Coming soon: News system with articles and external links'}
          </p>
        </div>
      </div>
    </div>
  );
}