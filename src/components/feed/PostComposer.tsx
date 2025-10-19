'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLocale } from '@/lib/hooks/useLocale';
import { Image, Send, X, Users, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { PostWithAuthor } from '@/lib/types/database';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { uploadMultipleFiles } from '@/lib/utils/storage';
import { validateFiles } from '@/lib/utils/validation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PostComposerProps {
  onPostCreated: (post: PostWithAuthor) => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { appUser } = useAuth();
  const { isArabic, direction } = useLocale();
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'org' | 'stream'>('org');
  const [selectedStream, setSelectedStream] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validation = validateFiles([...uploadedFiles, ...acceptedFiles]);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid files');
      return;
    }
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, [uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mpeg', '.mov', '.webm'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() || !appUser) return;

    setIsSubmitting(true);

    try {
      // Upload files if any
      let mediaUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        const uploadResults = await uploadMultipleFiles(uploadedFiles);
        mediaUrls = uploadResults
          .filter(result => !result.error)
          .map(result => result.url);
      }

      // Create post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          author_id: appUser.id,
          cohort_id: appUser.cohort_id,
          stream_id: visibility === 'stream' && selectedStream ? selectedStream : null,
          week_id: selectedWeek || null,
          visibility,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Upload media records
      if (mediaUrls.length > 0 && post) {
        const mediaData = uploadMultipleFiles(uploadedFiles)
          .filter(result => !result.error)
          .map((result, index) => ({
            post_id: post.id,
            url: result.url,
            type: result.type,
            filename: result.filename,
            size_bytes: result.size,
          }));

        const { error: mediaError } = await supabase
          .from('post_media')
          .insert(mediaData);

        if (mediaError) throw mediaError;
      }

      // Fetch complete post with relations
      const { data: completePost } = await supabase
        .from('posts')
        .select(`
          *,
          author:users!author_id(*),
          media:post_media(*),
          comments:comments(*, author:users!author_id(*)),
          reactions:reactions(*),
          stream:streams!stream_id(*)
        `)
        .eq('id', post!.id)
        .single();

      if (completePost) {
        onPostCreated(completePost);
      }

      // Reset form
      setContent('');
      setUploadedFiles([]);
      toast.success(isArabic ? 'تم نشر المنشور' : 'Post published');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(isArabic ? 'فشل نشر المنشور' : 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Text Area */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isArabic ? 'ماذا تريد أن تشارك؟' : 'What would you like to share?'}
          className={cn(
            "min-h-[100px] resize-none",
            direction === 'rtl' && 'text-right'
          )}
          disabled={isSubmitting}
        />

        {/* File Upload */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              {isArabic ? 'الملفات المرفقة:' : 'Attached files:'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-600 truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
          )}
        >
          <input {...getInputProps()} />
          <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? isArabic
                ? 'أفلت الملفات هنا...'
                : 'Drop files here...'
              : isArabic
              ? 'اسحب وأفلت الصور/الفيديوهات هنا، أو انقر للاختيار'
              : 'Drag & drop images/videos here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isArabic
              ? 'الصور: 3MB كحد أقصى، الفيديو: 20MB كحد أقصى'
              : 'Images: max 3MB, Videos: max 20MB'}
          </p>
        </div>

        {/* Visibility Options */}
        <div className="flex flex-wrap gap-4">
          <Select value={visibility} onValueChange={(v) => setVisibility(v as 'org' | 'stream')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="org">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{isArabic ? 'المنظمة' : 'Organization'}</span>
                </div>
              </SelectItem>
              <SelectItem value="stream">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>{isArabic ? 'التيار' : 'Stream'}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={isArabic ? 'الأسبوع' : 'Week'} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={`week-${i + 1}`}>
                  {isArabic ? `الأسبوع ${i + 1}` : `Week ${i + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isArabic ? 'نشر' : 'Post'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}