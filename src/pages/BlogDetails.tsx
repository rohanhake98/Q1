import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useBlog } from '../hooks/useBlogs';

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlog(slug || '');

  if (isLoading) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-16 animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/4 mb-10"></div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
        <Icon icon="lucide:book-open" className="text-5xl text-muted-foreground/60 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the blog post you were looking for.</p>
        <Link to="/" className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/95 transition shadow-sm">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-[700px] mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1] text-foreground mb-4">
          {blog.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {blog.author_name && (
            <>
              <span className="font-semibold text-foreground/80">{blog.author_name}</span>
              <span>·</span>
            </>
          )}
          <span>{new Date(blog.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
        </div>
      </header>

      {/* Featured Image */}
      {blog.featured_image && (
        <div className="rounded-2xl overflow-hidden aspect-video border border-border/20 mb-8 bg-muted">
          <img src={blog.featured_image} alt={blog.title} className="object-cover w-full h-full" />
        </div>
      )}

      {/* Body Content */}
      <div className="text-[16px] leading-[1.6] text-muted-foreground/90 whitespace-pre-wrap space-y-4">
        {blog.content}
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-border/20 flex flex-wrap gap-1.5">
          {blog.tags.map((tag: string) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground border border-border/20 px-3 py-1 rounded-full font-mono">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
