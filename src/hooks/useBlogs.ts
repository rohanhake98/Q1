import { useQuery } from '@tanstack/react-query';
import { getBlogBySlug, getLatestBlogs } from '../services/blogs';

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogBySlug(slug),
    enabled: !!slug,
  });
}

export function useLatestBlogs(limit = 3) {
  return useQuery({
    queryKey: ['blogs', 'latest', limit],
    queryFn: () => getLatestBlogs(limit),
  });
}
