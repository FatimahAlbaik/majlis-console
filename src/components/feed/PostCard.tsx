'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocale } from '@/lib/hooks/useLocale';
import { 
  Heart, 
  ThumbsUp, 
  Clapperboard, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  Pin,
  Trash2,
  Edit
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { PostWithAuthor, User } from '@/lib/types/database';
import { toast } from 'sonner';
import { cn, getInitials, getRandomColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Reactions } from './Reactions';
import { CommentsSection } from './CommentsSection';

interface PostCardProps {
  post: PostWithAuthor;
  currentUser: User;
  onPostUpdate: (post: PostWithAuthor) => void;
  onPostDelete: (postId: string) => void;
}

export function PostCard({ post, currentUser, onPostUpdate, onPostDelete }: PostCardProps) {
  const { isArabic, direction, formatRelativeTime } = useLocale();
  const { canEdit } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canModify = canEdit(post.author_id);
  const hasReacted = post.reactions.some(r => r.user_id === currentUser.id);

  const handleReaction = async (reactionType: '👍' | '👏' | '❤️') => {
    try {
      const existingReaction = post.reactions.find(
        r => r.user_id === currentUser.id && r.reaction_type === reactionType
      );

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) throw error;

        // Update local state
        const updatedPost = {
          ...post,
          reactions: post.reactions.filter(r => r.id !== existingReaction.id),
        };
        onPostUpdate(updatedPost);
      } else {
        // Add reaction
        const { data: newReaction, error } = await supabase
          .from('reactions')
          .insert({
            post_id: post.id,
            user_id: currentUser.id,
            reaction_type: reactionType,
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        const updatedPost = {
          ...post,
          reactions: [...post.reactions, newReaction],
        };
        onPostUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error(isArabic ? 'فشل التفاعل' : 'Failed to react');
    }
  };

  const handleDelete = async () => {
    if (!confirm(isArabic ? 'هل أنت متأكد من حذف هذا المنشور؟' : 'Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      onPostDelete(post.id);
      toast.success(isArabic ? 'تم حذف المنشور' : 'Post deleted');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(isArabic ? 'فشل حذف المنشور' : 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePin = async () => {
    try {
      const { data: updatedPost, error } = await supabase
        .from('posts')
        .update({ is_pinned: !post.is_pinned })
        .eq('id', post.id)
        .select()
        .single();

      if (error) throw error;

      onPostUpdate({ ...post, is_pinned: updatedPost.is_pinned });
      toast.success(
        updatedPost.is_pinned
          ? isArabic ? 'تم تثبيت المنشور' : 'Post pinned'
          : isArabic ? 'تم إلغاء تثبيت المنشور' : 'Post unpinned'
      );
    } catch (error) {
      console.error('Error pinning post:', error);
      toast.error(isArabic ? 'فشل تثبيت المنشور' : 'Failed to pin post');
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden",
      post.is_pinned && "border-primary",
      direction === 'rtl' && 'rtl'
    )}>
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar_url || undefined} />
              <AvatarFallback 
                style={{ backgroundColor: getRandomColor(post.author.id) }}
                className="text-white text-sm font-medium"
              >
                {getInitials(post.author.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {post.author.full_name}
                </h4>
                {post.stream && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {post.stream.name}
                  </span>
                )}
                {post.is_pinned && (
                  <Pin className="w-3 h-3 text-primary" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formatRelativeTime(post.created_at)}
                {post.visibility === 'stream' && (
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                    {isArabic ? 'خصوصي' : 'Private'}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Post Actions */}
          {canModify && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePin}>
                  {post.is_pinned
                    ? isArabic ? 'إلغاء التثبيت' : 'Unpin'
                    : isArabic ? 'تثبيت' : 'Pin'
                  }
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  {isArabic ? 'تعديل' : 'Edit'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isArabic ? 'حذف' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <p className={cn(
          "text-gray-900 whitespace-pre-wrap",
          direction === 'rtl' && 'text-right'
        )}>
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {post.media.map((media, index) => (
              <div key={media.id} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={media.filename || 'Post image'}
                    className="w-full h-full object-cover"
                  />
                ) : media.type === 'video' ? (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-sm text-gray-600">
                      {media.filename}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Reactions */}
            <Reactions
              reactions={post.reactions}
              onReact={handleReaction}
              currentUserId={currentUser.id}
            />

            {/* Comments */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments?.length || 0}</span>
            </Button>

            {/* Share */}
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>{isArabic ? 'مشاركة' : 'Share'}</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-500">
            {post.reactions.length} {isArabic ? 'تفاعل' : 'reactions'}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentsSection
          postId={post.id}
          comments={post.comments || []}
          currentUser={currentUser}
        />
      )}
    </Card>
  );
}