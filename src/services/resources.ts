import { supabase } from './supabase';

export async function getResourceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) {
    console.error('Error fetching resource by slug:', error);
    return null;
  }
  return data;
}

export async function getPublishedResources(category?: string) {
  let query = supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
    
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
  return data;
}
