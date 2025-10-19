'use client';

import { useLocale } from '@/lib/hooks/useLocale';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SuggestionsPage() {
  const { isArabic, direction } = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h1 className={cn(
          "text-3xl font-bold text-gray-900 mb-4",
          direction === 'rtl' && 'text-right'
        )}>
          {isArabic ? 'الاقتراحات' : 'Suggestions'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isArabic 
            ? 'شارك اقتراحاتك وافكارك لتحسين البرنامج' 
            : 'Share your suggestions and ideas to improve the program'}
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            {isArabic 
              ? 'قريباً: سيتم تمكين نظام الاقتراحات مع سير العمل حفظ المراجعة ➜ الحل' 
              : 'Coming soon: Suggestions system with workflow Save → Review → Resolve'}
          </p>
        </div>
      </div>
    </div>
  );
}