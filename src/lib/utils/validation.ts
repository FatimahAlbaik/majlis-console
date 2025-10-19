import { z } from 'zod';

// File validation constants
export const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
export const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/webm',
];
export const ALLOWED_PDF_TYPES = ['application/pdf'];

// Base schemas
export const postSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  stream_id: z.string().uuid().optional(),
  week_id: z.string().uuid().optional(),
  visibility: z.enum(['org', 'stream']).default('org'),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(1000, 'Comment too long'),
  post_id: z.string().uuid(),
});

export const activitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  holder: z.string().max(200, 'Holder name too long').optional(),
  week_id: z.string().uuid(),
  stream_id: z.string().uuid().optional(),
  activity_date: z.string().datetime(),
  location: z.string().max(200, 'Location too long').optional(),
  activity_type: z.string().max(50, 'Activity type too long').default('general'),
});

export const suggestionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  category: z.string().max(100, 'Category too long').optional(),
});

export const feedbackSchema = z.object({
  content: z.string().min(1, 'Feedback is required').max(2000, 'Feedback too long'),
  recipient_id: z.string().uuid().optional(),
  is_private: z.boolean().default(true),
});

export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  is_pinned: z.boolean().default(false),
  expires_at: z.string().datetime().optional(),
});

export const newsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
  summary: z.string().max(500, 'Summary too long').optional(),
  image_url: z.string().url().optional(),
  external_link: z.string().url().optional(),
  published_at: z.string().datetime().optional(),
});

export const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  url: z.string().url('Invalid URL'),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.string().max(100, 'Category too long').optional(),
  is_important: z.boolean().default(false),
});

export const importantEmailSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  sender_email: z.string().email('Invalid email address'),
  content: z.string().optional(),
  sent_date: z.string().datetime().optional(),
});

// File validation
export const fileSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => {
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return file.size <= MAX_IMAGE_SIZE;
      }
      if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return file.size <= MAX_VIDEO_SIZE;
      }
      if (ALLOWED_PDF_TYPES.includes(file.type)) {
        return file.size <= MAX_PDF_SIZE;
      }
      return false;
    },
    'File type not allowed or size exceeded'
  ),
});

export const multipleFilesSchema = z.object({
  files: z.array(z.instanceof(File)).refine(
    (files) => files.length <= 5,
    'Maximum 5 files allowed'
  ),
});

// User profile schema
export const userProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(200, 'Name too long'),
  bio: z.string().max(500, 'Bio too long').optional(),
  avatar_url: z.string().url().optional(),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query too long').optional(),
  category: z.string().optional(),
  stream_id: z.string().uuid().optional(),
  week_id: z.string().uuid().optional(),
  status: z.string().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Helper functions
export function validateFile(file: File): { valid: boolean; error?: string } {
  try {
    fileSchema.parse({ file });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: 'Invalid file' };
  }
}

export function validateFiles(files: File[]): { valid: boolean; error?: string } {
  try {
    multipleFilesSchema.parse({ files });
    
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        return validation;
      }
    }
    
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: 'Invalid files' };
  }
}

export function getFileType(file: File): 'image' | 'video' | 'pdf' | 'unknown' {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) return 'image';
  if (ALLOWED_VIDEO_TYPES.includes(file.type)) return 'video';
  if (ALLOWED_PDF_TYPES.includes(file.type)) return 'pdf';
  return 'unknown';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}