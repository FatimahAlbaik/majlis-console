// Generated types for Supabase Database
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          holder: string | null;
          week_id: string | null;
          stream_id: string | null;
          cohort_id: string;
          activity_date: string | null;
          location: string | null;
          activity_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          holder?: string | null;
          week_id?: string | null;
          stream_id?: string | null;
          cohort_id: string;
          activity_date?: string | null;
          location?: string | null;
          activity_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          holder?: string | null;
          week_id?: string | null;
          stream_id?: string | null;
          cohort_id?: string;
          activity_date?: string | null;
          location?: string | null;
          activity_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_media: {
        Row: {
          id: string;
          activity_id: string;
          url: string;
          type: string;
          filename: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          url: string;
          type: string;
          filename?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          url?: string;
          type?: string;
          filename?: string | null;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          cohort_id: string;
          is_pinned: boolean;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          cohort_id: string;
          is_pinned?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string;
          cohort_id?: string;
          is_pinned?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cohorts: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          post_id: string;
          author_id: string;
          cohort_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          post_id: string;
          author_id: string;
          cohort_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          post_id?: string;
          author_id?: string;
          cohort_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          content: string;
          sender_id: string;
          recipient_id: string | null;
          cohort_id: string;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          sender_id: string;
          recipient_id?: string | null;
          cohort_id: string;
          is_private?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          sender_id?: string;
          recipient_id?: string | null;
          cohort_id?: string;
          is_private?: boolean;
          created_at?: string;
        };
      };
      important_emails: {
        Row: {
          id: string;
          subject: string;
          sender_email: string;
          content: string | null;
          sent_date: string | null;
          cohort_id: string;
          added_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject: string;
          sender_email: string;
          content?: string | null;
          sent_date?: string | null;
          cohort_id: string;
          added_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject?: string;
          sender_email?: string;
          content?: string | null;
          sent_date?: string | null;
          cohort_id?: string;
          added_by?: string | null;
          created_at?: string;
        };
      };
      links: {
        Row: {
          id: string;
          title: string;
          url: string;
          description: string | null;
          category: string | null;
          author_id: string;
          cohort_id: string;
          is_important: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          description?: string | null;
          category?: string | null;
          author_id: string;
          cohort_id: string;
          is_important?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          description?: string | null;
          category?: string | null;
          author_id?: string;
          cohort_id?: string;
          is_important?: boolean;
          created_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          summary: string | null;
          image_url: string | null;
          external_link: string | null;
          author_id: string;
          cohort_id: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          summary?: string | null;
          image_url?: string | null;
          external_link?: string | null;
          author_id: string;
          cohort_id: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          summary?: string | null;
          image_url?: string | null;
          external_link?: string | null;
          author_id?: string;
          cohort_id?: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          content: string | null;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          content?: string | null;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          content?: string | null;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      post_media: {
        Row: {
          id: string;
          post_id: string;
          url: string;
          type: string;
          filename: string | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          url: string;
          type: string;
          filename?: string | null;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          url?: string;
          type?: string;
          filename?: string | null;
          size_bytes?: number | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          stream_id: string | null;
          cohort_id: string;
          week_id: string | null;
          visibility: string;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          author_id: string;
          stream_id?: string | null;
          cohort_id: string;
          week_id?: string | null;
          visibility?: string;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          author_id?: string;
          stream_id?: string | null;
          cohort_id?: string;
          week_id?: string | null;
          visibility?: string;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          reaction_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          reaction_type?: string;
          created_at?: string;
        };
      };
      streams: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      suggestions: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string | null;
          author_id: string;
          cohort_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category?: string | null;
          author_id: string;
          cohort_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string | null;
          author_id?: string;
          cohort_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          stream_id: string | null;
          cohort_id: string;
          avatar_url: string | null;
          bio: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          stream_id?: string | null;
          cohort_id: string;
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: string;
          stream_id?: string | null;
          cohort_id?: string;
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      weeks: {
        Row: {
          id: string;
          number: number;
          title: string;
          start_date: string | null;
          end_date: string | null;
          cohort_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: number;
          title: string;
          start_date?: string | null;
          end_date?: string | null;
          cohort_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: number;
          title?: string;
          start_date?: string | null;
          end_date?: string | null;
          cohort_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Type aliases for convenience
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Specific type exports
export type User = Tables<'users'>;
export type Post = Tables<'posts'>;
export type Comment = Tables<'comments'>;
export type Reaction = Tables<'reactions'>;
export type Activity = Tables<'activities'>;
export type Suggestion = Tables<'suggestions'>;
export type Feedback = Tables<'feedback'>;
export type Announcement = Tables<'announcements'>;
export type News = Tables<'news'>;
export type Link = Tables<'links'>;
export type Cohort = Tables<'cohorts'>;
export type Stream = Tables<'streams'>;
export type Week = Tables<'weeks'>;
export type PostMedia = Tables<'post_media'>;
export type ActivityMedia = Tables<'activity_media'>;
export type Notification = Tables<'notifications'>;

// Extended types with relations
export interface PostWithAuthor extends Post {
  author: User;
  media: PostMedia[];
  comments: Comment[];
  reactions: Reaction[];
  stream?: Stream;
}

export interface ActivityWithRelations extends Activity {
  week: Week;
  stream?: Stream;
  media: ActivityMedia[];
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface NotificationWithData extends Notification {
  data?: {
    postId?: string;
    commentId?: string;
    activityId?: string;
    [key: string]: any;
  };
}