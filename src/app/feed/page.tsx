'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocale } from '@/lib/hooks/useLocale';
import { PostComposer } from '@/components/feed/PostComposer';
import { PostCard } from '@/components/feed/PostCard';
import { RightRail } from '@/components/feed/RightRail';
import { supabase } from '@/lib/supabase/client';
import { PostWithAuthor } from '@/lib/types/database';
import { toast } from 'sonner';

export default function FeedPage() {
  const { appUser } = useAuth();
  const { isArabic } = useLocale();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  useEffect(() => {
    if (appUser) {
      fetchPosts();
      setupRealtimeSubscription();
    }
  }, [appUser]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:users!author_id(*),
          media:post_media(*),
          comments:comments(*, author:users!author_id(*)),
          reactions:reactions(*),
          stream:streams!stream_id(*)
        `)
        .eq('cohort_id', appUser?.cohort_id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error(isArabic ? 'فشل تحميل المنشورات' : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!isRealTimeEnabled) return;

    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: `cohort_id=eq.${appUser?.cohort_id}`,
        },
        (payload) => {
          // Handle new post
          if (payload.new) {
            fetchPosts();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `cohort_id=eq.${appUser?.cohort_id}`,
        },
        (payload) => {
          // Handle post update
          if (payload.new) {
            setPosts(prev => prev.map(post => 
              post.id === payload.new.id 
                ? { ...post, ...payload.new }
                : post
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleNewPost = (newPost: PostWithAuthor) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost: PostWithAuthor) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  if (!appUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isArabic ? 'يرجى تسجيل الدخول' : 'Please sign in'}
          </h2>
          <p className="text-gray-600">
            {isArabic ? 'يجب تسجيل الدخول لعرض الموجز' : 'You must be signed in to view the feed'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Post Composer */}
          <PostComposer onPostCreated={handleNewPost} />

          {/* Posts List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/4" />
                          <div className="h-3 bg-gray-300 rounded w-1/6" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded" />
                        <div className="h-4 bg-gray-300 rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isArabic ? 'لا توجد منشورات بعد' : 'No posts yet'}
                </h3>
                <p className="text-gray-600">
                  {isArabic ? 'كن أول من يشارك شيئاً!' : 'Be the first to share something!'}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={appUser}
                  onPostUpdate={handlePostUpdate}
                  onPostDelete={handlePostDelete}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Rail */}
        <div className="lg:col-span-4">
          <RightRail currentUser={appUser} />
        </div>
      </div>
    </div>
  );
}