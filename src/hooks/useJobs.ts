import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getJobBySlug, getCompanyWithJobs, getFeaturedJobs, searchJobs, type JobFilters } from '../services/jobs';

export function useJob(slug: string) {
  return useQuery({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug),
    enabled: !!slug,
  });
}

export function useCompany(slug: string) {
  return useQuery({
    queryKey: ['company', slug],
    queryFn: () => getCompanyWithJobs(slug),
    enabled: !!slug,
  });
}

export function useFeaturedJobs() {
  return useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: () => getFeaturedJobs(),
  });
}

export function useSearchJobs(filters: JobFilters) {
  return useInfiniteQuery({
    queryKey: ['jobs', 'search', filters],
    queryFn: ({ pageParam = 0 }) => searchJobs(filters, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((sum, page) => sum + page.data.length, 0);
      if (loadedCount < lastPage.count) {
        return allPages.length; // Next page parameter
      }
      return undefined; // No more pages available
    },
  });
}
