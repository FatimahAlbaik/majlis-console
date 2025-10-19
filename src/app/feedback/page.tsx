'use client';

import { useLocale } from '@/lib/hooks/useLocale';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeedbackPage() {
  const { isArabic, direction } = useLocale();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h1 className={cn(
          "text-3xl font-bold text-gray-900 mb-4",
          direction === 'rtl' && 'text-right'
        )}>
          {isArabic ? 'الملاحظات' : 'Feedback'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isArabic 
            ? 'قدم ملاحظات بناءة للزملاء والبرنامج' 
            : 'Provide constructive feedback to peers and the program'}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800">
            {isArabic 
              ? 'قريباً: نظام الملاحظات الخاص والعام مع رؤية محددة للأدوار' 
              : 'Coming soon: Private and public feedback system with role-specific visibility'}
          </p>
        </div>
      </div>
    </div>
  );
}