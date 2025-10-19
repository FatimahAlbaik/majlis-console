'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  Lightbulb, 
  Mail, 
  Megaphone, 
  Newspaper, 
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Feed', nameAr: 'الموجز', href: '/feed', icon: Home },
  { name: 'Activities', nameAr: 'الأنشطة', href: '/activities', icon: Calendar },
  { name: 'Members', nameAr: 'الأعضاء', href: '/members', icon: Users },
  { name: 'Suggestions', nameAr: 'الاقتراحات', href: '/suggestions', icon: Lightbulb },
  { name: 'Feedback', nameAr: 'الملاحظات', href: '/feedback', icon: MessageSquare },
  { name: 'Announcements', nameAr: 'الإعلانات', href: '/announcements', icon: Megaphone },
  { name: 'News', nameAr: 'الأخبار', href: '/news', icon: Newspaper },
  { name: 'Important', nameAr: 'المهم', href: '/important', icon: Bookmark },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isArabic, direction } = useLocale();

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-10",
      isCollapsed ? 'w-16' : 'w-64',
      direction === 'rtl' && 'left-auto right-0 border-l border-r-0'
    )}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100 transition-colors",
              "w-full flex items-center justify-center"
            )}
          >
            {isCollapsed ? (
              direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            ) : (
              direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-gray-100 hover:text-gray-900",
                  isActive ? "bg-primary text-white" : "text-gray-700",
                  direction === 'rtl' && 'flex-row-reverse space-x-reverse'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span>{isArabic ? item.nameAr : item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                {isArabic ? 'الإصدار 1.0.0' : 'Version 1.0.0'}
              </div>
              <div className="text-xs text-gray-400">
                {isArabic ? 'مجموعة ٦' : 'Cohort 6'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}