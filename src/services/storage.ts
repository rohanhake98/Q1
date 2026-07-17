import { supabase } from './supabase';

/**
 * Uploads a file to a designated Supabase storage bucket
 * @param bucketName Name of the Supabase bucket (e.g. 'job-assets', 'blog-assets', 'resource-assets')
 * @param file The File object to upload
 * @returns The public URL of the uploaded asset
 */
export async function uploadFile(bucketName: string, file: File): Promise<string> {
  // Generate unique file path to prevent collision
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error(`Error uploading file to storage bucket "${bucketName}":`, error);
    throw error;
  }

  // Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrl;
}
