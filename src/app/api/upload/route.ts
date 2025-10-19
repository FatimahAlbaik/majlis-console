import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf'];
    const maxSizes = {
      'image': 3 * 1024 * 1024, // 3MB
      'video': 20 * 1024 * 1024, // 20MB
      'application/pdf': 10 * 1024 * 1024, // 10MB
    };

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    const fileType = file.type.split('/')[0];
    const maxSize = maxSizes[fileType as keyof typeof maxSizes] || maxSizes['image'];

    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds limit' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${user.id}/${timestamp}_${randomSuffix}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      filename: file.name,
      type: fileType,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}