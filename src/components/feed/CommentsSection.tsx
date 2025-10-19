'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocale } from '@/lib/hooks/useLocale';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { CommentWithAuthor, User } from '@/lib/types/database';
import { toast } from 'sonner';
import { cn, getInitials, getRandomColor } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentsSectionProps {
  postId: string;
  comments: CommentWithAuthor[];
  currentUser: User;
}

export function CommentsSection({ postId, comments, currentUser }: CommentsSectionProps) {
  const { isArabic, direction, formatRelativeTime } = useLocale();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          post_id: postId,
          author_id: currentUser.id,
          cohort_id: currentUser.cohort_id,
        })
        .select(`*, author:users!author_id(*)`)
        .single();

      if (error) throw error;

      setNewComment('');
      toast.success(isArabic ? 'تم إضافة التعليق' : 'Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(isArabic ? 'فشل إضافة التعليق' : 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200">
      {/* Comments List */}
      <div className="p-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author.avatar_url || undefined} />
              <AvatarFallback 
                style={{ backgroundColor: getRandomColor(comment.author.id) }}
                className="text-white text-xs font-medium"
              >
                {getInitials(comment.author.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-sm text-gray-900">
                    {comment.author.full_name}
                  </h5>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
                <p className={cn(
                  "text-sm text-gray-700",
                  direction === 'rtl' && 'text-right'
                )}>
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">
            {isArabic ? 'لا توجد تعليقات بعد' : 'No comments yet'}
          </p>
        )}
      </div>

      {/* Comment Input */}
      <div className="p-6 pt-0">
        <div className="flex space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.avatar_url || undefined} />
            <AvatarFallback 
              style={{ backgroundColor: getRandomColor(currentUser.id) }}
              className="text-white text-xs font-medium"
            >
              {getInitials(currentUser.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isArabic ? 'اكتب تعليقاً...' : 'Write a comment...'}
              className={cn(
                "min-h-[60px] resize-none",
                direction === 'rtl' && 'text-right'
              )}
              disabled={isSubmitting}
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Send className="w-3 h-3" />
                <span>{isArabic ? 'إرسال' : 'Send'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}