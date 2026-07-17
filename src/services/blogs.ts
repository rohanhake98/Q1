import { supabase } from './supabase';

export async function getBlogBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
  return data;
}

export async function getLatestBlogs(limit = 3) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  }
  return data;
}
