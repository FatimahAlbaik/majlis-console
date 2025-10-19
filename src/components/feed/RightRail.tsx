'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/lib/hooks/useLocale';
import { Pin, Calendar, Users, Link as LinkIcon, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/types/database';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RightRailProps {
  currentUser: User;
}

export function RightRail({ currentUser }: RightRailProps) {
  const { isArabic, direction } = useLocale();
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState<any[]>([]);
  const [thisWeekActivities, setThisWeekActivities] = useState<any[]>([]);
  const [importantLinks, setImportantLinks] = useState<any[]>([]);
  const [importantEmails, setImportantEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRightRailData();
  }, [currentUser]);

  const fetchRightRailData = async () => {
    try {
      setIsLoading(true);

      // Fetch pinned announcements
      const { data: announcements } = await supabase
        .from('announcements')
        .select(`*, author:users!author_id(full_name)`)
        .eq('cohort_id', currentUser.cohort_id)
        .eq('is_pinned', true)
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch this week's activities
      const { data: activities } = await supabase
        .from('activities')
        .select(`*, week:weeks(*), stream:streams(name)`)
        .eq('cohort_id', currentUser.cohort_id)
        .gte('activity_date', new Date().toISOString())
        .order('activity_date', { ascending: true })
        .limit(5);

      // Fetch important links
      const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('cohort_id', currentUser.cohort_id)
        .eq('is_important', true)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch important emails
      const { data: emails } = await supabase
        .from('important_emails')
        .select('*')
        .eq('cohort_id', currentUser.cohort_id)
        .order('sent_date', { ascending: false })
        .limit(3);

      setPinnedAnnouncements(announcements || []);
      setThisWeekActivities(activities || []);
      setImportantLinks(links || []);
      setImportantEmails(emails || []);
    } catch (error) {
      console.error('Error fetching right rail data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded" />
                <div className="h-3 bg-gray-300 rounded w-5/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
              <Pin className="w-4 h-4 text-primary" />
              <span>{isArabic ? 'إعلانات مثبتة' : 'Pinned Announcements'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pinnedAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  {announcement.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {announcement.author.full_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(announcement.created_at, false, isArabic ? 'ar' : 'en')}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* This Week's Activities */}
      {thisWeekActivities.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{isArabic ? 'أنشطة هذا الأسبوع' : "This Week's Activities"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {thisWeekActivities.map((activity) => (
              <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  {activity.title}
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>{activity.holder}</p>
                  <p>
                    {formatDate(activity.activity_date, false, isArabic ? 'ar' : 'en')}
                    {activity.location && ` • ${activity.location}`}
                  </p>
                  {activity.stream && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {activity.stream.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Important Links */}
      {importantLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
              <LinkIcon className="w-4 h-4 text-primary" />
              <span>{isArabic ? 'روابط مهمة' : 'Important Links'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {importantLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <h4 className="font-medium text-sm text-gray-900">
                  {link.title}
                </h4>
                {link.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {link.description}
                  </p>
                )}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Important Emails */}
      {importantEmails.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
              <Mail className="w-4 h-4 text-primary" />
              <span>{isArabic ? 'رسائل مهمة' : 'Important Emails'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {importantEmails.map((email) => (
              <div key={email.id} className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  {email.subject}
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>{email.sender_email}</p>
                  {email.sent_date && (
                    <p>
                      {formatDate(email.sent_date, false, isArabic ? 'ar' : 'en')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm font-semibold">
            <Users className="w-4 h-4 text-primary" />
            <span>{isArabic ? 'إحصائيات سريعة' : 'Quick Stats'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {isArabic ? 'الأعضاء النشطون' : 'Active Members'}
              </span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {isArabic ? 'المنشورات هذا الأسبوع' : 'Posts This Week'}
              </span>
              <span className="font-medium">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {isArabic ? 'الأنشطة القادمة' : 'Upcoming Activities'}
              </span>
              <span className="font-medium">8</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}