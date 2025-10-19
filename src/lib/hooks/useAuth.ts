'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';

type AppUser = Database['public']['Tables']['users']['Row'];

interface AuthState {
  user: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    appUser: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAppUser(session.user.id);
      } else {
        setAuthState({
          user: null,
          appUser: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchAppUser(session.user.id);
        } else {
          setAuthState({
            user: null,
            appUser: null,
            isLoading: false,
            isAuthenticated: false,
          });
          router.push('/auth/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchAppUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setAuthState({
        user: { id: userId } as User, // Simplified user object
        appUser: data,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error fetching app user:', error);
      setAuthState({
        user: null,
        appUser: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const hasRole = (role: 'admin' | 'fellow' | 'member') => {
    return authState.appUser?.role === role;
  };

  const canEdit = (authorId: string) => {
    if (!authState.appUser) return false;
    return authState.appUser.role === 'admin' || authState.appUser.id === authorId;
  };

  return {
    ...authState,
    signOut,
    hasRole,
    canEdit,
    refetch: () => {
      if (authState.user) {
        fetchAppUser(authState.user.id);
      }
    },
  };
}