'use client';

import { useLocale } from '@/lib/hooks/useLocale';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImportantPage() {
  const { isArabic, direction } = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h1 className={cn(
          "text-3xl font-bold text-gray-900 mb-4",
          direction === 'rtl' && 'text-right'
        )}>
          {isArabic ? 'المهم' : 'Important'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isArabic 
            ? 'الوصول السريع للروابط والرسائل المهمة' 
            : 'Quick access to important links and emails'}
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">
            {isArabic 
              ? 'قريباً: الروابط المهمة والبريد الإلكتروني مع التصنيف والبحث' 
              : 'Coming soon: Important links and emails with categorization and search'}
          </p>
        </div>
      </div>
    </div>
  );
}