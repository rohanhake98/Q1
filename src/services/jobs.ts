import { supabase } from './supabase';

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
