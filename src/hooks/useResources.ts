import { useQuery } from '@tanstack/react-query';
import { getResourceBySlug, getPublishedResources } from '../services/resources';

export function useResource(slug: string) {
  return useQuery({
    queryKey: ['resource', slug],
    queryFn: () => getResourceBySlug(slug),
    enabled: !!slug,
  });
}

export function usePublishedResources(category?: string) {
  return useQuery({
    queryKey: ['resources', 'published', category || 'all'],
    queryFn: () => getPublishedResources(category),
  });
}
