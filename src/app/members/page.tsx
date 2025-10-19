'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocale } from '@/lib/hooks/useLocale';
import { Users, Search, Mail, Briefcase, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/types/database';
import { cn, getInitials, getRandomColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MembersPage() {
  const { appUser } = useAuth();
  const { isArabic, direction } = useLocale();
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (appUser) {
      fetchMembers();
    }
  }, [appUser]);

  useEffect(() => {
    filterMembers();
  }, [members, searchQuery]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`*, stream:streams!stream_id(name)`)
        .eq('cohort_id', appUser?.cohort_id)
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members.filter(member =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.bio && member.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredMembers(filtered);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'fellow':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
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
            {isArabic ? 'يجب تسجيل الدخول لعرض الأعضاء' : 'You must be signed in to view members'}
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
          {isArabic ? 'الأعضاء' : 'Members'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isArabic ? 'تعرف على أعضاء مجموعتك' : 'Get to know your cohort members'}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={isArabic ? 'بحث عن أعضاء...' : 'Search members...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isArabic ? 'الأعضاء الكلي' : 'Total Members'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">F</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isArabic ? 'زملاء' : 'Fellows'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.role === 'fellow').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">M</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isArabic ? 'أعضاء' : 'Members'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.role === 'member').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">A</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isArabic ? 'نشيطون' : 'Active'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => m.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isArabic ? 'لم يتم العثور على أعضاء' : 'No members found'}
          </h3>
          <p className="text-gray-600">
            {isArabic ? 'حاول تغيير بحثك' : 'Try changing your search'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-16 h-16 mb-4">
                    <AvatarImage src={member.avatar_url || undefined} />
                    <AvatarFallback 
                      style={{ backgroundColor: getRandomColor(member.id) }}
                      className="text-white text-lg font-medium"
                    >
                      {getInitials(member.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {member.full_name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    {member.email}
                  </p>

                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full mb-2",
                    getRoleColor(member.role)
                  )}>
                    {member.role}
                  </span>

                  {member.stream && (
                    <p className="text-xs text-gray-500 mb-3">
                      {member.stream.name}
                    </p>
                  )}

                  {member.bio && (
                    <p className="text-sm text-gray-700 text-center mb-4">
                      {member.bio}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {isArabic ? 'رسالة' : 'Message'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {isArabic ? 'الملف' : 'Profile'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}