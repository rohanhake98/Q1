import { supabase } from './supabase';

export interface JobFilters {
  search?: string;
  location?: string;
  workMode?: string;
  employmentType?: string;
  category?: string;
  skills?: string[];
}

export async function getJobBySlug(slug: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('job_slug', slug)
    .eq('status', 'published')
    .single();
  if (error) {
    console.error('Error fetching job by slug:', error);
    return null;
  }
  return data;
}

export async function getCompanyWithJobs(slug: string) {
  const companyQuery = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (companyQuery.error) {
    console.error('Error fetching company:', companyQuery.error);
    return null;
  }

  const jobsQuery = await supabase
    .from('jobs')
    .select('*')
    .eq('company_slug', slug)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  return {
    company: companyQuery.data,
    jobs: jobsQuery.data || []
  };
}

export async function getFeaturedJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) {
    console.error('Error fetching featured jobs:', error);
    return [];
  }
  return data;
}

export async function searchJobs(filters: JobFilters, page: number) {
  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters.workMode && filters.workMode !== 'All') {
    query = query.eq('work_mode', filters.workMode.toLowerCase());
  }
  if (filters.employmentType && filters.employmentType !== 'All') {
    query = query.eq('employment_type', filters.employmentType.toLowerCase());
  }
  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  if (filters.skills && filters.skills.length > 0) {
    query = query.contains('tags', filters.skills);
  }

  const PAGE_SIZE = 20;
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error searching jobs:', error);
    return { data: [], count: 0 };
  }

  return { data: data || [], count: count || 0 };
}
