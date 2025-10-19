'use client';

import { useLocale } from '@/lib/hooks/useLocale';
import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnnouncementsPage() {
  const { isArabic, direction } = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h1 className={cn(
          "text-3xl font-bold text-gray-900 mb-4",
          direction === 'rtl' && 'text-right'
        )}>
          {isArabic ? 'الإعلانات' : 'Announcements'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isArabic 
            ? 'ابقَ على اطلاع بأهم الإعلانات والتحديثات' 
            : 'Stay updated with important announcements and updates'}
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            {isArabic 
              ? 'قريباً: نظام الإعلانات مع وظيفة التثبيت والانتهاء التلقائي' 
              : 'Coming soon: Announcements system with pinning and auto-expiry features'}
          </p>
        </div>
      </div>
    </div>
  );
}