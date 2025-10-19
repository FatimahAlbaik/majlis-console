'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocale } from '@/lib/hooks/useLocale';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ActivityWithRelations } from '@/lib/types/database';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ActivitiesPage() {
  const { appUser } = useAuth();
  const { isArabic, direction } = useLocale();
  const [activities, setActivities] = useState<ActivityWithRelations[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityWithRelations[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [weeks, setWeeks] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (appUser) {
      fetchActivities();
      fetchFilters();
    }
  }, [appUser]);

  useEffect(() => {
    filterActivities();
  }, [activities, selectedWeek, selectedStream]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          week:weeks(*),
          stream:streams!stream_id(*),
          media:activity_media(*)
        `)
        .eq('cohort_id', appUser?.cohort_id)
        .order('activity_date', { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      // Fetch weeks
      const { data: weeksData } = await supabase
        .from('weeks')
        .select('*')
        .eq('cohort_id', appUser?.cohort_id)
        .order('number', { ascending: true });

      // Fetch streams
      const { data: streamsData } = await supabase
        .from('streams')
        .select('*');

      setWeeks(weeksData || []);
      setStreams(streamsData || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (selectedWeek !== 'all') {
      filtered = filtered.filter(activity => activity.week_id === selectedWeek);
    }

    if (selectedStream !== 'all') {
      filtered = filtered.filter(activity => activity.stream_id === selectedStream);
    }

    setFilteredActivities(filtered);
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800';
      case 'lab':
        return 'bg-green-100 text-green-800';
      case 'team-building':
        return 'bg-purple-100 text-purple-800';
      case 'orientation':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!appUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isArabic ? 'يرجى تسجيل الدخول' : 'Please sign in'}
          </h2>
          <p className="text-gray-600">
            {isArabic ? 'يجب تسجيل الدخول لعرض الأنشطة' : 'You must be signed in to view activities'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className={cn(
          "text-3xl font-bold text-gray-900",
          direction === 'rtl' && 'text-right'
        )}>
          {isArabic ? 'الأنشطة' : 'Activities'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isArabic ? 'اكتشف وشارك في أنشطة مجموعتك' : 'Discover and participate in your cohort activities'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={isArabic ? 'جميع الأسابيع' : 'All Weeks'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isArabic ? 'جميع الأسابيع' : 'All Weeks'}
            </SelectItem>
            {weeks.map((week) => (
              <SelectItem key={week.id} value={week.id}>
                {isArabic ? `الأسبوع ${week.number}` : `Week ${week.number}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStream} onValueChange={setSelectedStream}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={isArabic ? 'جميع التيارات' : 'All Streams'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isArabic ? 'جميع التيارات' : 'All Streams'}
            </SelectItem>
            {streams.map((stream) => (
              <SelectItem key={stream.id} value={stream.id}>
                {stream.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded" />
                  <div className="h-3 bg-gray-300 rounded w-5/6" />
                  <div className="h-3 bg-gray-300 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isArabic ? 'لا توجد أنشطة' : 'No activities found'}
          </h3>
          <p className="text-gray-600">
            {isArabic ? 'حاول تغيير عوامل التصفية' : 'Try changing your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {activity.title}
                  </CardTitle>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    getActivityTypeColor(activity.activity_type)
                  )}>
                    {activity.activity_type}
                  </span>
                </div>
                {activity.stream && (
                  <p className="text-sm text-gray-600">
                    {activity.stream.name}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {activity.description && (
                  <p className="text-sm text-gray-700 mb-4">
                    {activity.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  {activity.holder && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{activity.holder}</span>
                    </div>
                  )}

                  {activity.activity_date && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDate(activity.activity_date, false, isArabic ? 'ar' : 'en')}
                      </span>
                    </div>
                  )}

                  {activity.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{activity.location}</span>
                    </div>
                  )}

                  {activity.week && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isArabic ? `الأسبوع ${activity.week.number}` : `Week ${activity.week.number}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1">
                    {isArabic ? 'انضمام' : 'Join'}
                  </Button>
                  <Button size="sm" variant="outline">
                    {isArabic ? 'تفاصيل' : 'Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}