import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useSearchJobs } from '../hooks/useJobs';

// --- TYPES & INTERFACES ---
interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyColor: string;
  location: string;
  salary?: string;
  type: string;
  category: string;
  description: string;
  summary?: string;
  experience?: string;
  workMode?: string;
  deadline?: string;
  skills: string[];
  posted: string;
  slug: string;
  applyUrl?: string;
}

// --- STATIC SAMPLE DATA (FALLBACK) ---
const SAMPLE_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Engineering Intern',
    company: 'Linear',
    companyLogo: 'L',
    companyColor: 'bg-purple-600',
    location: 'Remote · US/EU',
    salary: '$45 - $65 / hr',
    type: 'Internship',
    category: 'Engineering',
    experience: '0–1 Years',
    workMode: 'Remote',
    deadline: '31 July 2026',
    description: 'Work closely with our product engineers to build highly responsive, keyboard-navigable UI surfaces. Experience with React, TypeScript, and clean CSS styling is required.',
    summary: 'Join Linear to build highly responsive, keyboard-navigable web apps with React and TypeScript.',
    skills: ['React', 'TypeScript', 'Tailwind', 'CSS', 'Vite', 'HTML'],
    posted: '2 hours ago',
    slug: 'linear-frontend-intern',
    applyUrl: 'https://linear.app/careers'
  },
  {
    id: '2',
    title: 'Software Engineer Intern',
    company: 'Notion',
    companyLogo: 'N',
    companyColor: 'bg-black dark:bg-zinc-800',
    location: 'San Francisco, CA',
    salary: '$50 - $75 / hr',
    type: 'Internship',
    category: 'Engineering',
    experience: '0–1 Years',
    workMode: 'On-site',
    deadline: '15 August 2026',
    description: 'Help craft the future of wiki and documents. You will join one of our core product teams working on block editing performance and document collaboration systems.',
    summary: 'Help Notion scale block editing performance and collaborative document editors.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    posted: '1 day ago',
    slug: 'notion-software-intern',
    applyUrl: 'https://notion.so/careers'
  },
  {
    id: '3',
    title: 'Product Design Intern',
    company: 'Ramp',
    companyLogo: 'R',
    companyColor: 'bg-amber-600',
    location: 'New York, NY',
    salary: '$40 - $60 / hr',
    type: 'Internship',
    category: 'Design',
    experience: '0–2 Years',
    workMode: 'Hybrid',
    deadline: '30 August 2026',
    description: 'Design the next generation of financial automation tools. You will collaborate on core workflows, building prototypes and conducting user interviews.',
    summary: 'Work at Ramp on corporate card workflows, financial automation pipelines, and high-fidelity Figma prototypes.',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research', 'Product Design'],
    posted: '3 days ago',
    slug: 'ramp-design-intern',
    applyUrl: 'https://ramp.com/careers'
  },
  {
    id: '4',
    title: 'Full Stack Engineer',
    company: 'Stripe',
    companyLogo: 'S',
    companyColor: 'bg-indigo-600',
    location: 'Remote · Global',
    salary: '$145,000 - $185,000',
    type: 'Full-time',
    category: 'Engineering',
    experience: '3+ Years',
    workMode: 'Remote',
    deadline: '10 September 2026',
    description: 'Scale payment infrastructure for millions of businesses. Work on billing APIs, subscription platforms, or dashboard features used by global companies.',
    summary: 'Scale Stripe billing APIs and multi-tenant payment systems for millions of businesses.',
    skills: ['Ruby', 'Java', 'React', 'REST APIs', 'SQL', 'Docker', 'AWS'],
    posted: 'Just now',
    slug: 'stripe-full-stack',
    applyUrl: 'https://stripe.com/careers'
  },
  {
    id: '5',
    title: 'Research Engineering Intern',
    company: 'OpenAI',
    companyLogo: 'O',
    companyColor: 'bg-teal-700',
    location: 'San Francisco, CA',
    salary: '$80 - $100 / hr',
    type: 'Internship',
    category: 'Engineering',
    experience: '0–1 Years',
    workMode: 'Hybrid',
    deadline: '15 July 2026',
    description: 'Support the training and deployment of large language models. Develop evaluation frameworks, optimize inference speeds, and construct custom data pipelines.',
    summary: 'Train large language models, construct data ingestion pipelines, and build ML evaluation frameworks.',
    skills: ['Python', 'PyTorch', 'Transformers', 'CUDA', 'Docker', 'C++'],
    posted: '5 days ago',
    slug: 'openai-research-intern',
    applyUrl: 'https://openai.com/careers'
  }
];

const JobsInternships: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const categories = ['All', 'Engineering', 'Design', 'Product', 'Marketing'];
  const types = ['All', 'Internship', 'Full-time'];

  // Construct filters for Supabase query
  const filters = {
    search: search || undefined,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    employmentType: selectedType === 'All' ? undefined : selectedType,
  };

  // Run query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useSearchJobs(filters);

  // Flatten the fetched database pages
  const dbJobs = data?.pages.flatMap(page => page.data) || [];
  const hasDbJobs = dbJobs.length > 0;

  // Filter sample mock jobs client-side as fallback
  const filteredSampleJobs = SAMPLE_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Decide what data source to display
  const rawJobsList = hasDbJobs ? dbJobs : filteredSampleJobs;

  // Map to unified Job schema for rendering
  const jobsToDisplay: Job[] = rawJobsList.map(job => {
    const isDb = 'job_slug' in job;
    if (isDb) {
      return {
        id: job.id,
        title: job.title,
        company: job.company_name || 'Unknown Company',
        companyLogo: job.company_logo || (job.company_name ? job.company_name[0] : 'Q'),
        companyColor: 'bg-primary',
        location: job.location || 'Remote',
        salary: job.salary && job.salary !== 'Not specified' ? job.salary : undefined,
        type: job.employment_type === 'full-time' ? 'Full Time' : job.employment_type === 'internship' ? 'Internship' : 'Co-op',
        category: job.category || 'Engineering',
        description: job.description || '',
        summary: job.summary || undefined,
        experience: job.experience || 'Not specified',
        workMode: job.work_mode ? job.work_mode.charAt(0).toUpperCase() + job.work_mode.slice(1) : 'Remote',
        deadline: job.deadline || undefined,
        skills: job.tags || [],
        posted: job.created_at 
          ? new Date(job.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })
          : 'Recent',
        slug: job.job_slug,
        applyUrl: job.apply_url
      };
    } else {
      return job as Job;
    }
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-[1180px] w-full mx-auto px-6 md:px-8 py-10">
      

      {/* HEADER SECTION */}
      <div className="mb-10 text-left">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-3">
          <span className="w-2 h-2 rounded-full bg-primary flex-none animate-pulse"></span>
          Live Opportunities
        </span>
        <h1 className="font-sans font-semibold text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] m-0 text-foreground">
          Explore Active Jobs & <span className="font-serif italic font-medium text-primary">Internships</span>
        </h1>
        <p className="text-[15px] leading-[1.5] text-muted-foreground/90 max-w-[640px] mt-3">
          Find curated career opportunities and leverage AI assistance to craft top-tier application forms directly in your browser.
        </p>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-card border border-border/50 rounded-xl p-5 md:p-6 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-300">
        {/* Search Box */}
        <div className="relative w-full md:max-w-md">
          <Icon icon="lucide:search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/80 text-lg" />
          <input
            type="text"
            placeholder="Search title, company, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2.5 pl-11 pr-4 text-sm transition-all text-foreground"
          />
          {search && (
            <button 
              type="button" 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Icon icon="lucide:x" className="text-sm" />
            </button>
          )}
        </div>

        {/* Category Tabs & Job Type Select */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex bg-muted p-1 rounded-lg border border-border/20 overflow-x-auto whitespace-nowrap max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex bg-muted p-1 rounded-lg border border-border/20">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                  selectedType === t 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS LIST / SKELETON */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border/20 rounded-xl p-6 h-56 animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
              <div className="space-y-2 mt-6">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : jobsToDisplay.length > 0 ? (
        <div>
          {/* Card list layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {jobsToDisplay.map(job => {
              // Generate summary preview (max 180 chars, fallback to description truncate)
              const summaryText = job.summary || 
                (job.description ? job.description.slice(0, 180) + (job.description.length > 180 ? '...' : '') : '');

              const displayedSkills = job.skills.slice(0, 4);
              const remainingSkillsCount = job.skills.length - displayedSkills.length;

              return (
                <Link 
                  key={job.id} 
                  to={`/jobs/${job.slug}`}
                  className="bg-card border border-border/40 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 flex flex-col justify-between cursor-pointer h-full group text-left no-underline select-none"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Company Logo override */}
                        {job.companyLogo.startsWith('http') ? (
                          <img 
                            src={job.companyLogo} 
                            alt={`${job.company} logo`}
                            className="w-10 h-10 rounded-lg object-cover bg-muted border border-border/20 flex-none"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg ${job.companyColor || 'bg-primary'} text-white flex items-center justify-center font-bold text-base shadow-inner flex-none`}>
                            {job.companyLogo || job.company[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold m-0">{job.company}</p>
                          <h3 className="font-sans font-semibold text-[16px] text-foreground tracking-tight m-0 mt-0.5 group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                        </div>
                      </div>
                      <span className="text-[11.5px] text-muted-foreground/60 font-mono flex-none">{job.posted}</span>
                    </div>

                    {/* Basic specs Row */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground font-medium pt-0.5 border-t border-border/20 pt-3">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:briefcase" className="text-muted-foreground/80 text-[13px]" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:map-pin" className="text-muted-foreground/80 text-[13px]" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:monitor" className="text-muted-foreground/80 text-[13px]" />
                        <span>{job.workMode}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:clock" className="text-muted-foreground/80 text-[13px]" />
                        <span>{job.type}</span>
                      </div>
                    </div>

                    {/* Salary (if available) */}
                    {job.salary && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold">
                        <Icon icon="lucide:indian-rupee" className="text-[12px] -mt-0.5" />
                        <span>{job.salary}</span>
                      </div>
                    )}

                    {/* Short Summary Description (max 3 clamped lines) */}
                    <p className="text-[13.5px] leading-relaxed text-muted-foreground/80 line-clamp-3 m-0">
                      {summaryText}
                    </p>
                  </div>

                  <div className="space-y-4 mt-6">
                    {/* Skills Badge Row (Single row, no-wrap, first 4-6 then +N more) */}
                    <div className="flex items-center justify-between gap-3 overflow-hidden border-t border-border/20 pt-4">
                      <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
                        {displayedSkills.map(skill => (
                          <span 
                            key={skill}
                            className="text-[10px] font-mono tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/20 flex-none"
                          >
                            {skill}
                          </span>
                        ))}
                        {remainingSkillsCount > 0 && (
                          <span className="text-[10px] font-mono font-bold text-primary flex-none bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                            +{remainingSkillsCount} More
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Deadline block if available */}
                    {job.deadline && (
                      <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground/60 font-mono">
                        <Icon icon="lucide:calendar-clock" />
                        <span>Apply Before {formatDate(job.deadline)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Load More Button for Live Supabase Mode */}
          {hasDbJobs && hasNextPage && (
            <div className="mt-12 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-2 border border-border hover:border-foreground bg-card text-foreground font-semibold px-6 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 text-sm shadow-sm"
              >
                {isFetchingNextPage ? (
                  <>
                    <Icon icon="line-md:loading-twotone-loop" />
                    Loading More...
                  </>
                ) : (
                  'Load More Opportunities'
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center shadow-sm">
          <Icon icon="lucide:briefcase-alert" className="text-[48px] text-muted-foreground/60 mx-auto" />
          <h3 className="font-semibold text-lg mt-4 mb-2">No jobs found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            We couldn't find any matches for your current filters. Try adjusting your search term or category.
          </p>
        </div>
      )}

    </div>
  );
};

export default JobsInternships;
