import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useJob } from '../hooks/useJobs';
import { supabase } from '../services/supabase';

// --- MOCK FALLBACK DATA FOR SAMPLE JOBS ---
const MOCK_EXTRAS: Record<string, {
  responsibilities: string[];
  requirements: string[];
  preferredSkills: string[];
  benefits: string[];
  education: string;
  hiringProcess: string[];
  applicationSteps: string[];
  importantDates: { label: string; date: string }[];
  aboutCompany: string;
}> = {
  'linear-frontend-intern': {
    responsibilities: [
      'Implement clean, accessible keyboard navigation controls for complex layout surfaces.',
      'Refactor high-frequency UI interactions to optimize layout rendering times under 16ms.',
      'Collaborate with product designers to build and refine components in our core Design System.',
      'Write comprehensive unit and integration tests using Vitest and Testing Library.'
    ],
    requirements: [
      'Strong proficiency in React, TypeScript, and semantic HTML5/CSS3.',
      'Solid understanding of browser rendering pipelines, reflows, and performance profiling.',
      'Experience building accessible web components conforming to WAI-ARIA standards.',
      'A keen eye for layout composition, typography details, and micro-interactions.'
    ],
    preferredSkills: ['Next.js', 'TailwindCSS', 'Framer Motion', 'Web Accessibility (WCAG 2.1)'],
    benefits: [
      'Competitive intern stipend with equity grant potential.',
      'Remote work allowance (covers home office desk, chair, and computer gear).',
      'Flexible working hours and synchronous core collaboration time.',
      'Direct mentorship from senior frontend staff and engineers.'
    ],
    education: 'Pursuing or recently completed BS/MS in Computer Science, HCI, or equivalent technical training.',
    hiringProcess: [
      'Step 1: Resume screening & portfolio review',
      'Step 2: 45-minute technical screen (Live coding in React)',
      'Step 3: 60-minute panel interview (System design & core web concepts)',
      'Step 4: Chat with our Product Lead & offer'
    ],
    applicationSteps: [
      '1. Review the requirements and upload your resume.',
      '2. Complete the custom profile assessment via Q1click Autofill.',
      '3. Submit application and wait 3-5 days for engineering review.'
    ],
    importantDates: [
      { label: 'Applications Open', date: 'June 1, 2026' },
      { label: 'Application Deadline', date: 'July 31, 2026' },
      { label: 'Interviews Commencing', date: 'August 5, 2026' }
    ],
    aboutCompany: 'Linear builds tools that help teams plan and build products. Known for its speed, execution-focused design, and keyboard-first shortcuts, Linear is loved by software teams globally.'
  },
  'notion-software-intern': {
    responsibilities: [
      'Participate in the architectural design of real-time collaborative document synchronizers.',
      'Construct performance evaluation frameworks to monitor document loading speeds.',
      'Optimize database search index patterns inside PostgreSQL for workspace blocks.',
      'Collaborate on public API endpoints for developers integrating with Notion pages.'
    ],
    requirements: [
      'Solid foundation in algorithms, concurrency models, and data structure designs.',
      'Experience writing servers using Node.js, Express, or fastify.',
      'Good familiarity with relational databases and SQL query execution analysis.',
      'Experience with WebSocket protocols or conflict-free replicated data types (CRDTs) is a huge plus.'
    ],
    preferredSkills: ['TypeScript', 'PostgreSQL', 'Redis', 'WebSockets', 'Rust'],
    benefits: [
      'Top-of-market hourly compensation ($50–$75/hr).',
      'Complimentary chef-prepared lunches at the San Francisco headquarters.',
      'Full health benefits coverage for the duration of the internship.',
      'Commuter transit subsidy & gym membership allowances.'
    ],
    education: 'Currently enrolled in an undergraduate or graduate degree in Software Engineering, Maths, or related fields.',
    hiringProcess: [
      'Step 1: Resume vetting & automated coding puzzle',
      'Step 2: 1-hour systems and concurrency interview',
      'Step 3: Onsite loop (technical deep-dive & team match)',
      'Step 4: Executive sponsor wrap-up'
    ],
    applicationSteps: [
      '1. Click Apply Now to open Notion’s official Lever application.',
      '2. Autofill form inputs using Q1click browser tools.',
      '3. Check email for technical task instructions.'
    ],
    importantDates: [
      { label: 'Applications Open', date: 'May 15, 2026' },
      { label: 'Application Deadline', date: 'August 15, 2026' },
      { label: 'Expected Start Date', date: 'September 1, 2026' }
    ],
    aboutCompany: 'Notion is a single space where you can think, write, and plan. It serves as an all-in-one workspace for notes, tasks, databases, and collaboration, powered by blocks.'
  }
};

export default function JobDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading, error } = useJob(slug || '');
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);
  const [companyDesc, setCompanyDesc] = useState<string | null>(null);



  // Fetch related jobs and company description once job loads
  useEffect(() => {
    if (!job) return;

    const fetchAdditionalData = async () => {
      try {
        // 1. Fetch related jobs (same category, excluding current)
        const { data: relData } = await supabase
          .from('jobs')
          .select('id, title, job_slug, company_name, company_logo, location, employment_type, salary')
          .eq('status', 'published')
          .eq('category', job.category || 'Engineering')
          .neq('id', job.id)
          .limit(3);
        if (relData) setRelatedJobs(relData);

        // 2. Fetch company description if company exists
        if (job.company_slug) {
          const { data: compData } = await supabase
            .from('companies')
            .select('description')
            .eq('slug', job.company_slug)
            .single();
          if (compData?.description) setCompanyDesc(compData.description);
        }
      } catch (err) {
        console.error('Error fetching details metadata:', err);
      }
    };

    fetchAdditionalData();
  }, [job]);

  if (isLoading) {
    return (
      <div className="max-w-[1100px] mx-auto px-6 py-16 animate-pulse space-y-8">
        <div className="h-44 bg-muted rounded-2xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
          <div className="h-64 bg-muted rounded-xl"></div>
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

  // Retrieve mock overrides or format from DB columns
  const mockKey = job.job_slug || '';
  const extras = MOCK_EXTRAS[mockKey] || {
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    preferredSkills: job.preferred_skills || [],
    benefits: job.benefits || [],
    education: job.education || 'Bachelor’s degree or equivalent experience.',
    hiringProcess: [
      'Step 1: Application submission and review',
      'Step 2: Technical/Portfolio evaluation screen',
      'Step 3: Onsite/Video panel panel loop',
      'Step 4: Final offer formulation'
    ],
    applicationSteps: [
      '1. Review roles and criteria description on this page.',
      '2. Trigger AI Quick Apply to load application forms.',
      '3. Verify values and click submit on target career platform.'
    ],
    importantDates: [
      { label: 'Applications Open', date: 'Active' },
      { label: 'Deadline', date: job.deadline ? new Date(job.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Open until filled' }
    ],
    aboutCompany: companyDesc || 'We are a fast-growing technology platform focused on building customer-centered applications and services.'
  };



  return (
    <div className="max-w-[1100px] w-full mx-auto px-6 md:px-8 py-10">
      
      {/* Back button */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors no-underline">
        <Icon icon="lucide:arrow-left" />
        Back to listings
      </Link>

      {/* HERO HEADER SECTION */}
      <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-sm mb-8 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          {job.company_logo && job.company_logo.startsWith('http') ? (
            <img 
              src={job.company_logo} 
              alt={`${job.company_name} logo`} 
              className="w-16 h-16 rounded-2xl object-cover bg-muted border border-border/20 flex-none"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-inner flex-none">
              {job.company_name ? job.company_name[0] : 'Q'}
            </div>
          )}
          <div>
            <span className="text-xs font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-semibold">
              {job.employment_type === 'full-time' ? 'Full Time' : job.employment_type === 'internship' ? 'Internship' : 'Co-op'}
            </span>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight m-0 mt-2">{job.title}</h1>
            <p className="text-base text-muted-foreground font-medium mt-1">{job.company_name}</p>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all gap-2 text-sm whitespace-nowrap no-underline"
            >
              Apply Now
              <Icon icon="lucide:external-link" className="text-xs" />
            </a>
          )}
        </div>
      </div>

      {/* CORE CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CORE JOB DATA */}
        <div className="lg:col-span-2 space-y-10 text-left">
          
          {/* 1. About Company */}
          <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
              <Icon icon="lucide:building-2" className="text-primary" />
              About Company
            </h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap m-0">
              {extras.aboutCompany}
            </p>
          </section>

          {/* 2. Job Description */}
          <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
              <Icon icon="lucide:file-text" className="text-primary" />
              Job Description
            </h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground/90 whitespace-pre-wrap m-0">
              {job.description}
            </p>
          </section>

          {/* 3. Responsibilities */}
          {extras.responsibilities && extras.responsibilities.length > 0 && (
            <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
                <Icon icon="lucide:list-todo" className="text-primary" />
                Responsibilities
              </h3>
              <ul className="list-disc list-inside space-y-2.5 text-[14.5px] text-muted-foreground/90 pl-1 m-0">
                {extras.responsibilities.map((resp: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">{resp}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 4. Requirements */}
          {extras.requirements && extras.requirements.length > 0 && (
            <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
                <Icon icon="lucide:award" className="text-primary" />
                Requirements
              </h3>
              <ul className="list-disc list-inside space-y-2.5 text-[14.5px] text-muted-foreground/90 pl-1 m-0">
                {extras.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">{req}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 5. Skills Section */}
          {job.tags && job.tags.length > 0 && (
            <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
                <Icon icon="lucide:check-square-2" className="text-primary" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2 m-0">
                {job.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-mono bg-muted text-muted-foreground border border-border/20 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 6. Preferred Skills */}
          {extras.preferredSkills && extras.preferredSkills.length > 0 && (
            <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
                <Icon icon="lucide:sparkles" className="text-primary" />
                Preferred Skills
              </h3>
              <div className="flex flex-wrap gap-2 m-0">
                {extras.preferredSkills.map((skill: string) => (
                  <span key={skill} className="text-xs font-mono bg-primary/5 text-primary border border-primary/20 px-3 py-1 rounded-full font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 7. Benefits */}
          {extras.benefits && extras.benefits.length > 0 && (
            <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
                <Icon icon="lucide:heart-handshake" className="text-primary" />
                Benefits & Perks
              </h3>
              <ul className="list-disc list-inside space-y-2.5 text-[14.5px] text-muted-foreground/90 pl-1 m-0">
                {extras.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">{benefit}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 8. Education */}
          <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
              <Icon icon="lucide:graduation-cap" className="text-primary" />
              Education
            </h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground/90 m-0">
              {extras.education}
            </p>
          </section>

          {/* 9. Hiring Process */}
          <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
              <Icon icon="lucide:git-commit" className="text-primary" />
              Hiring Process
            </h3>
            <div className="space-y-4 m-0">
              {extras.hiringProcess.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-none w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold grid place-items-center mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-[14.5px] text-muted-foreground/90 font-medium">{step.substring(step.indexOf(':') + 1).trim()}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Application Steps */}
          <section className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-4 m-0 border-b border-border/20 pb-3 flex items-center gap-2">
              <Icon icon="lucide:arrow-right-circle" className="text-primary" />
              Application Steps
            </h3>
            <div className="space-y-3 m-0">
              {extras.applicationSteps.map((step, idx) => (
                <p key={idx} className="text-[14.5px] text-muted-foreground/90 leading-relaxed m-0 font-medium">
                  {step}
                </p>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: APPLICATION SPECS & GENERAL INFO */}
        <div className="space-y-8 text-left">
          
          {/* Quick Specs card */}
          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-mono uppercase text-muted-foreground tracking-wider mb-2 border-b border-border/20 pb-2">
              Quick Specifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Icon icon="lucide:briefcase" className="text-primary text-lg" />
                <div>
                  <span className="text-xs text-muted-foreground block">Experience Requirement</span>
                  <span className="text-sm font-semibold text-foreground">{job.experience || 'Not specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icon icon="lucide:map-pin" className="text-primary text-lg" />
                <div>
                  <span className="text-xs text-muted-foreground block">HQ Location</span>
                  <span className="text-sm font-semibold text-foreground">{job.location || 'Remote'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icon icon="lucide:monitor" className="text-primary text-lg" />
                <div>
                  <span className="text-xs text-muted-foreground block">Work Mode</span>
                  <span className="text-sm font-semibold text-foreground capitalize">{job.work_mode || 'Remote'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icon icon="lucide:clock" className="text-primary text-lg" />
                <div>
                  <span className="text-xs text-muted-foreground block">Employment Type</span>
                  <span className="text-sm font-semibold text-foreground capitalize">{job.employment_type || 'Full-time'}</span>
                </div>
              </div>

              {job.salary && (
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:indian-rupee" className="text-primary text-lg" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Estimated Salary</span>
                    <span className="text-sm font-semibold text-foreground">{job.salary}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Dates widget */}
          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-mono uppercase text-muted-foreground tracking-wider mb-2 border-b border-border/20 pb-2">
              Important Dates
            </h3>
            <div className="space-y-3">
              {extras.importantDates.map((date, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">{date.label}</span>
                  <span className="font-semibold text-foreground">{date.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company General Information Card */}
          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-mono uppercase text-muted-foreground tracking-wider mb-2 border-b border-border/20 pb-2">
              Company Information
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>HQ:</strong> {job.location || 'Remote'}</p>
              <p><strong>Industry:</strong> Tech & Development</p>
              {job.apply_url && (
                <p>
                  <strong>Website: </strong>
                  <a 
                    href={job.apply_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline font-semibold"
                  >
                    Portal website
                  </a>
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: RELATED OPPORTUNITIES */}
      {relatedJobs.length > 0 && (
        <div className="mt-16 border-t border-border/30 pt-12 text-left">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 m-0">
            <Icon icon="lucide:compass" className="text-primary" />
            Related Opportunities
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedJobs.map(rel => (
              <Link 
                key={rel.id} 
                to={`/jobs/${rel.job_slug}`}
                className="bg-card border border-border/40 hover:border-primary/50 hover:shadow-md rounded-xl p-5 transition-all duration-300 group no-underline text-left"
              >
                <h4 className="font-semibold text-[14.5px] text-foreground group-hover:text-primary transition-colors m-0">
                  {rel.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium m-0">{rel.company_name} · {rel.location}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/20 uppercase font-semibold">
                    {rel.employment_type === 'full-time' ? 'Full Time' : rel.employment_type === 'internship' ? 'Intern' : 'Co-op'}
                  </span>
                  <span className="text-[11.5px] font-mono text-primary font-semibold hover:underline">View details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

</div>
  );
}
