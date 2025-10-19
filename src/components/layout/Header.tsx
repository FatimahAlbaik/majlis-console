'use client';

import { useState } from 'react';
import { Bell, Search, Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocale } from '@/lib/hooks/useLocale';
import { cn, getInitials, getRandomColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showHijri, setShowHijri] = useState(false);
  const { appUser, signOut } = useAuth();
  const { locale, direction, isArabic, switchLocale, formatDate } = useLocale();

  const today = formatDate(new Date(), showHijri);

  return (
    <header className={cn(
      "bg-white border-b border-gray-200 px-4 py-3",
      direction === 'rtl' && 'rtl'
    )}>
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">
            {isArabic ? 'كونسول المجلس' : 'Majlis Console'}
          </h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span>{today}</span>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showHijri}
                onCheckedChange={setShowHijri}
                size="sm"
              />
              <span className="text-xs">{isArabic ? 'هجري' : 'Hijri'}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث...' : 'Search...'}
              className={cn(
                "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                isArabic && "text-right"
              )}
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-600" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => switchLocale(isArabic ? 'en' : 'ar')}
              className="text-sm"
            >
              {isArabic ? 'EN' : 'العربية'}
            </Button>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h3 className="font-semibold mb-2">
                  {isArabic ? 'الإشعارات' : 'Notifications'}
                </h3>
                <div className="space-y-2">
                  <div className="p-2 text-sm text-gray-600">
                    {isArabic ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {appUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={appUser.avatar_url || undefined} />
                    <AvatarFallback 
                      style={{ backgroundColor: getRandomColor(appUser.id) }}
                      className="text-white text-sm font-medium"
                    >
                      {getInitials(appUser.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{appUser.full_name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-500">
                      {appUser.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {isArabic ? 'الملف الشخصي' : 'Profile'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {isArabic ? 'الإعدادات' : 'Settings'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  {isArabic ? 'تسجيل الخروج' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}