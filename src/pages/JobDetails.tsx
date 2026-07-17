import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useJob } from '../hooks/useJobs';

export default function JobDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading, error } = useJob(slug || '');

  if (isLoading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-16 animate-pulse">
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/4 mb-10"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
        <Icon icon="lucide:briefcase-alert" className="text-5xl text-muted-foreground/60 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Job Listing Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the job application you were looking for. It may have expired or been removed.</p>
        <Link to="/jobs" className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/95 transition shadow-sm">
          Return to Job Board
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      {/* Back button */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <Icon icon="lucide:arrow-left" />
        Back to all jobs
      </Link>

      {/* Header Info */}
      <div className="border border-border/40 bg-card rounded-2xl p-6 md:p-8 shadow-sm mb-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-inner flex-none">
              {job.company_name[0]}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight m-0">{job.title}</h1>
              <p className="text-base text-muted-foreground font-medium mt-1">{job.company_name}</p>
            </div>
          </div>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all gap-2 text-sm whitespace-nowrap"
          >
            Apply Externally
            <Icon icon="lucide:external-link" className="text-xs" />
          </a>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/30 mt-6 pt-6">
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">Location</span>
            <div className="text-[14.5px] font-medium mt-0.5 flex items-center gap-1">
              <Icon icon="lucide:map-pin" className="text-primary text-xs" />
              {job.location || 'Remote'}
            </div>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">Job Type</span>
            <div className="text-[14.5px] font-medium mt-0.5 capitalize">{job.employment_type || 'Full-time'}</div>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">Work Mode</span>
            <div className="text-[14.5px] font-medium mt-0.5 capitalize">{job.work_mode || 'Remote'}</div>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">Salary Range</span>
            <div className="text-[14.5px] font-medium mt-0.5">{job.salary || 'Not specified'}</div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-3 border-b border-border/30 pb-2">Role Description</h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">{job.description}</p>
        </div>

        {job.responsibilities && job.responsibilities.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 border-b border-border/30 pb-2">Key Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground/90 pl-1">
              {job.responsibilities.map((resp: string, idx: number) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 border-b border-border/30 pb-2">Key Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-muted-foreground/90 pl-1">
              {job.requirements.map((req: string, idx: number) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {job.tags && job.tags.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 border-b border-border/30 pb-2">Target Skills & Tags</h2>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((tag: string) => (
                <span key={tag} className="text-xs font-mono bg-muted text-muted-foreground border border-border/20 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
