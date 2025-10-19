import { supabase } from '@/lib/supabase/client';
import { validateFile, getFileType, formatFileSize } from '@/lib/utils/validation';

interface UploadResult {
  url: string;
  filename: string;
  type: string;
  size: number;
  error?: string;
}

interface UploadOptions {
  bucket?: string;
  path?: string;
  generateUniqueName?: boolean;
}

export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        url: '',
        filename: '',
        type: '',
        size: 0,
        error: validation.error || 'Invalid file',
      };
    }

    const bucket = options.bucket || 'media';
    const fileType = getFileType(file);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    let filename = file.name;
    if (options.generateUniqueName !== false) {
      const extension = file.name.split('.').pop();
      filename = `${timestamp}_${randomSuffix}.${extension}`;
    }

    const filePath = options.path 
      ? `${options.path}/${filename}`
      : filename;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        url: '',
        filename: '',
        type: '',
        size: 0,
        error: error.message,
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      filename: file.name,
      type: fileType,
      size: file.size,
    };
  } catch (error) {
    return {
      url: '',
      filename: '',
      type: '',
      size: 0,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function uploadMultipleFiles(
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  
  for (const file of files) {
    const result = await uploadFile(file, options);
    results.push(result);
  }
  
  return results;
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const filePath = urlParts.slice(-2).join('/'); // Assuming format: .../bucket/path
    
    const bucket = urlParts[urlParts.length - 3]; // Extract bucket name
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export async function deleteMultipleFiles(urls: string[]): Promise<boolean> {
  try {
    const results = await Promise.all(
      urls.map(url => deleteFile(url))
    );
    
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error deleting files:', error);
    return false;
  }
}

export function getFileIcon(type: string): string {
  switch (type) {
    case 'image':
      return '📷';
    case 'video':
      return '🎥';
    case 'pdf':
      return '📄';
    default:
      return '📎';
  }
}

export function generateThumbnail(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set thumbnail size
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function getMediaMetadata(file: File) {
  return {
    filename: file.name,
    size: file.size,
    type: file.type,
    sizeFormatted: formatFileSize(file.size),
    fileType: getFileType(file),
    lastModified: new Date(file.lastModified),
  };
}