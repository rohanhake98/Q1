import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useCompany } from '../hooks/useJobs';

export default function CompanyDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useCompany(slug || '');

  if (isLoading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-16 animate-pulse">
        <div className="h-16 bg-muted rounded-xl w-1/3 mb-6"></div>
        <div className="h-4 bg-muted rounded w-full mb-3"></div>
        <div className="h-4 bg-muted rounded w-2/3 mb-10"></div>
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded-xl w-full"></div>
          <div className="h-20 bg-muted rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
        <Icon icon="lucide:building-2" className="text-5xl text-muted-foreground/60 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Company Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the company profile you were looking for.</p>
        <Link to="/jobs" className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/95 transition shadow-sm">
          Go to Job Board
        </Link>
      </div>
    );
  }

  const { company, jobs } = data;

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      {/* Header Info */}
      <div className="border border-border/40 bg-card rounded-2xl p-6 md:p-8 shadow-sm mb-8 transition-colors">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-foreground text-background flex items-center justify-center font-bold text-3xl shadow-inner flex-none">
            {company.name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight m-0">{company.name}</h1>
            <p className="text-base text-muted-foreground mt-2">{company.hq_location || 'Global Headquarters'}</p>
            {company.website_url && (
              <a
                href={company.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-3"
              >
                Visit website
                <Icon icon="lucide:external-link" className="text-xs" />
              </a>
            )}
          </div>
        </div>

        {/* Company specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/30 mt-6 pt-6 text-sm">
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">Industry</span>
            <div className="font-medium mt-0.5">{company.industry || 'Tech'}</div>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">Company Size</span>
            <div className="font-medium mt-0.5">{company.company_size || '100 - 500'}</div>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">HQ Location</span>
            <div className="font-medium mt-0.5">{company.hq_location || 'Not Specified'}</div>
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase">Founded</span>
            <div className="font-medium mt-0.5">{company.founded_year || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-3 border-b border-border/30 pb-2">About {company.name}</h2>
        <p className="text-[15px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">
          {company.description || 'No description available for this company.'}
        </p>
      </div>

      {/* Jobs list */}
      <div>
        <h2 className="text-lg font-semibold mb-6 border-b border-border/30 pb-2 flex items-center gap-2">
          Open Positions
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">
            {jobs.length}
          </span>
        </h2>

        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div 
                key={job.id} 
                className="bg-card border border-border/40 hover:border-primary/50 rounded-xl p-5 transition-all duration-300 hover:shadow-sm flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-base text-foreground m-0 hover:text-primary transition-colors">
                    <Link to={`/jobs/${job.job_slug}`}>{job.title}</Link>
                  </h3>
                  <div className="text-xs text-muted-foreground font-medium mt-1.5 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Icon icon="lucide:map-pin" />
                      {job.location}
                    </span>
                    <span>·</span>
                    <span className="capitalize">{job.employment_type}</span>
                    <span>·</span>
                    <span className="capitalize">{job.work_mode}</span>
                  </div>
                </div>
                <Link
                  to={`/jobs/${job.job_slug}`}
                  className="w-9 h-9 rounded-lg border border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground grid place-items-center transition-all cursor-pointer"
                >
                  <Icon icon="lucide:chevron-right" className="text-lg" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
            No open job postings at this time.
          </div>
        )}
      </div>
    </div>
  );
}
