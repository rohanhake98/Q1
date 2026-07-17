import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useResource } from '../hooks/useResources';

export default function ResourceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: resource, isLoading, error } = useResource(slug || '');

  if (isLoading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-16 animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/4 mb-10"></div>
        <div className="h-60 bg-muted rounded-2xl w-full"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
        <Icon icon="lucide:download" className="text-5xl text-muted-foreground/60 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Resource Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the resource file you were looking for.</p>
        <Link to="/" className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/95 transition shadow-sm">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left side: thumbnail preview */}
        <div className="md:col-span-1">
          <div className="rounded-2xl overflow-hidden aspect-[3/4] border border-border/30 bg-muted shadow-sm">
            {resource.thumbnail_url ? (
              <img src={resource.thumbnail_url} alt={resource.title} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 p-4 text-center">
                <Icon icon="lucide:file-text" className="text-4xl mb-2" />
                <span className="text-xs font-mono">No Preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side: details & download action */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-semibold uppercase">
              {resource.category || 'Downloadable'}
            </span>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mt-4 mb-3">
              {resource.title}
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">
              {resource.description || 'No description provided for this resource.'}
            </p>
          </div>

          <div className="border-t border-border/30 mt-6 pt-6 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={resource.pdf_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all gap-2 text-[14px]"
            >
              <Icon icon="lucide:download" className="text-base" />
              Download Document (PDF)
            </a>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
