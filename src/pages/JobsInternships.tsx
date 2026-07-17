import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useSearchJobs } from '../hooks/useJobs';

// --- TYPES & INTERFACES ---
interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyColor: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  description: string;
  skills: string[];
  posted: string;
  slug?: string;
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
    description: 'Work closely with our product engineers to build highly responsive, keyboard-navigable UI surfaces. Experience with React, TypeScript, and clean CSS styling is required.',
    skills: ['React', 'TypeScript', 'Tailwind', 'CSS'],
    posted: '2 days ago',
    slug: 'linear-frontend-intern'
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
    description: 'Help craft the future of wiki and documents. You will join one of our core product teams working on block editing performance and document collaboration systems.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    posted: '1 day ago',
    slug: 'notion-software-intern'
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
    description: 'Design the next generation of financial automation tools. You will collaborate on core workflows, building prototypes and conducting user interviews.',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'Product Strategy'],
    posted: '3 days ago',
    slug: 'ramp-design-intern'
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
    description: 'Scale payment infrastructure for millions of businesses. Work on billing APIs, subscription platforms, or dashboard features used by global companies.',
    skills: ['Ruby', 'Java', 'React', 'REST APIs'],
    posted: 'Just now',
    slug: 'stripe-full-stack'
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
    description: 'Support the training and deployment of large language models. Develop evaluation frameworks, optimize inference speeds, and construct custom data pipelines.',
    skills: ['Python', 'PyTorch', 'Transformers', 'CUDA'],
    posted: '5 days ago',
    slug: 'openai-research-intern'
  },
  {
    id: '6',
    title: 'Developer Relations Intern',
    company: 'Vercel',
    companyLogo: 'V',
    companyColor: 'bg-zinc-900',
    location: 'Remote · US',
    salary: '$35 - $55 / hr',
    type: 'Internship',
    category: 'Marketing',
    description: 'Create educational content, sample applications, and documentation to help web developers deploy and scale using Next.js and the Vercel Platform.',
    skills: ['Next.js', 'React', 'Technical Writing', 'Public Speaking'],
    posted: '1 week ago',
    slug: 'vercel-devrel-intern'
  },
  {
    id: '7',
    title: 'Associate Product Manager',
    company: 'Figma',
    companyLogo: 'F',
    companyColor: 'bg-rose-500',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$110,000 - $140,000',
    type: 'Full-time',
    category: 'Product',
    description: 'Drive the feature roadmap for our collaborative multiplayer system. Write specifications, define metrics, and run scrum sprint planning cycles.',
    skills: ['Agile', 'Product Specs', 'Data Analytics', 'UX Design'],
    posted: '4 days ago',
    slug: 'figma-apm'
  }
];

const JobsInternships: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Quick Apply Modal & Animation state
  const [activeJobForApply, setActiveJobForApply] = useState<Job | null>(null);
  const [applyStep, setApplyStep] = useState<number>(0);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Engineering', 'Design', 'Product', 'Marketing'];
  const types = ['All', 'Internship', 'Full-time'];

  // Construct filters for Supabase query
  const filters = {
    search: search || undefined,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    employmentType: selectedType === 'All' ? undefined : selectedType,
  };

  // Run infinite query from React Query / Supabase
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
      // Map Supabase SQL columns to UI properties
      return {
        id: job.id,
        title: job.title,
        company: job.company_name || 'Unknown Company',
        companyLogo: job.company_logo || (job.company_name ? job.company_name[0] : 'Q'),
        companyColor: 'bg-primary',
        location: job.location || 'Remote',
        salary: job.salary || 'Not specified',
        type: job.employment_type === 'full-time' ? 'Full-time' : job.employment_type === 'internship' ? 'Internship' : 'Co-op',
        category: job.category || 'Engineering',
        description: job.description || '',
        skills: job.tags || [],
        posted: job.created_at 
          ? new Date(job.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })
          : 'Recent',
        slug: job.job_slug,
        applyUrl: job.apply_url
      };
    } else {
      // Use fallback properties
      return job as Job;
    }
  });

  const handleQuickApply = (job: Job) => {
    if (appliedJobs[job.id]) return;
    setActiveJobForApply(job);
    setApplyStep(1);

    // Run progressive autofill simulation steps
    setTimeout(() => {
      setApplyStep(2); // Parsing profile
      setTimeout(() => {
        setApplyStep(3); // Generating answers
        setTimeout(() => {
          setApplyStep(4); // Form snapped
          setTimeout(() => {
            setApplyStep(5); // Completed
            setAppliedJobs(prev => ({ ...prev, [job.id]: true }));
          }, 1500);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  const closeApplyModal = () => {
    setActiveJobForApply(null);
    setApplyStep(0);
  };

  return (
    <div className="max-w-[1180px] w-full mx-auto px-6 md:px-8 py-10">
      
      {/* Fallback Banner for Mock Mode */}
      {!hasDbJobs && !isLoading && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary animate-[fadeIn_0.3s_ease-out] transition-colors">
          <div className="flex items-center gap-2.5">
            <Icon icon="lucide:info" className="text-lg flex-none" />
            <span>
              <strong>Demo Mode:</strong> Displaying mock opportunities. Setup your Supabase dashboard and insert job rows to pull live database listings.
            </span>
          </div>
          <Link to="/admin" className="font-semibold underline hover:opacity-85 flex-none whitespace-nowrap">
            Go to Admin Dashboard
          </Link>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="mb-10 text-left">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-3">
          <span className="w-2 h-2 rounded-full bg-primary flex-none animate-pulse"></span>
          Live Job Postings
        </span>
        <h1 className="font-sans font-semibold text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] m-0 text-foreground">
          Explore Active Jobs & <span className="font-serif italic font-medium text-primary">Internships</span>
        </h1>
        <p className="text-[15px] leading-[1.5] text-muted-foreground/90 max-w-[640px] mt-3">
          Apply to hot opportunities across top tech companies using Q1click. Let our AI autofill your applications in your own browser with customized details.
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobsToDisplay.map(job => (
              <div 
                key={job.id} 
                className="bg-card border border-border/40 hover:border-primary/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex flex-col h-full group"
              >
                {/* Upper row: Logo & Header */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${job.companyColor || 'bg-primary'} text-white flex items-center justify-center font-bold text-lg shadow-inner flex-none`}>
                    {job.companyLogo || (job.company ? job.company[0] : 'Q')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-sans font-semibold text-[17px] text-foreground tracking-tight m-0 group-hover:text-primary transition-colors">
                      <Link to={`/jobs/${job.slug || job.id}`} className="hover:text-primary transition-colors">
                        {job.title}
                      </Link>
                    </h3>
                    <div className="text-[13.5px] text-muted-foreground font-medium mt-1 flex items-center gap-1.5">
                      <span>{job.company}</span>
                      <span>·</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[14px] leading-[1.5] text-muted-foreground/90 mt-4 flex-1">
                  {job.description}
                </p>

                {/* Skills/Badges */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  <span className="text-[10px] font-mono tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-semibold">
                    {job.type}
                  </span>
                  {job.skills.map(skill => (
                    <span 
                      key={skill}
                      className="text-[10px] font-mono tracking-wider bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full border border-border/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Bottom line: Posted date and Apply Button */}
                <div className="h-px bg-border/30 mt-5 mb-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] text-muted-foreground/60 font-mono">
                    {job.posted}
                  </span>
                  <button
                    onClick={() => handleQuickApply(job)}
                    className={`inline-flex items-center justify-center font-semibold text-[13px] tracking-[-0.01em] rounded-lg cursor-pointer transition-all duration-200 px-4 py-2 gap-2 shadow-sm ${
                      appliedJobs[job.id]
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-foreground text-background border border-transparent hover:-translate-y-0.5 hover:shadow-md'
                    }`}
                  >
                    {appliedJobs[job.id] ? (
                      <>
                        <Icon icon="lucide:check" className="text-sm" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Icon icon="lucide:zap" className="text-sm text-yellow-500 fill-current" />
                        Quick Apply
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
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
        </>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center shadow-sm">
          <Icon icon="lucide:briefcase-alert" className="text-[48px] text-muted-foreground/60 mx-auto" />
          <h3 className="font-semibold text-lg mt-4 mb-2">No jobs found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            We couldn't find any matches for your current filters. Try adjusting your search term or category.
          </p>
        </div>
      )}

      {/* QUICK APPLY SIMULATION MODAL */}
      {activeJobForApply && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-card border border-border/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${activeJobForApply.companyColor || 'bg-primary'} text-white flex items-center justify-center font-bold text-base shadow-inner`}>
                  {activeJobForApply.companyLogo || (activeJobForApply.company ? activeJobForApply.company[0] : 'Q')}
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-base text-foreground m-0">
                    Applying via Q1click
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeJobForApply.title} at {activeJobForApply.company}
                  </p>
                </div>
              </div>
              <button 
                onClick={closeApplyModal}
                className="w-7 h-7 rounded-full bg-muted border border-border/50 grid place-items-center hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <Icon icon="lucide:x" className="text-sm" />
              </button>
            </div>

            {/* Animation / Progress State */}
            <div className="space-y-5">
              
              {/* Step 1: Connecting to ATS */}
              <div className="flex items-center gap-3">
                <div className="flex-none w-6 h-6 rounded-full flex items-center justify-center">
                  {applyStep >= 1 ? (
                    applyStep > 1 ? (
                      <Icon icon="lucide:check-circle" className="text-primary text-xl" />
                    ) : (
                      <Icon icon="line-md:loading-twotone-loop" className="text-primary text-xl" />
                    )
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></span>
                  )}
                </div>
                <span className={`text-[13.5px] font-medium ${applyStep === 1 ? 'text-primary' : applyStep > 1 ? 'text-foreground/75' : 'text-muted-foreground'}`}>
                  Connecting to {activeJobForApply.company} job portal...
                </span>
              </div>

              {/* Step 2: Parsing Profile */}
              <div className="flex items-center gap-3">
                <div className="flex-none w-6 h-6 rounded-full flex items-center justify-center">
                  {applyStep >= 2 ? (
                    applyStep > 2 ? (
                      <Icon icon="lucide:check-circle" className="text-primary text-xl" />
                    ) : (
                      <Icon icon="line-md:loading-twotone-loop" className="text-primary text-xl" />
                    )
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></span>
                  )}
                </div>
                <span className={`text-[13.5px] font-medium ${applyStep === 2 ? 'text-primary' : applyStep > 2 ? 'text-foreground/75' : 'text-muted-foreground'}`}>
                  Retrieving your resume & cover story...
                </span>
              </div>

              {/* Step 3: Generating answers */}
              <div className="flex items-center gap-3">
                <div className="flex-none w-6 h-6 rounded-full flex items-center justify-center">
                  {applyStep >= 3 ? (
                    applyStep > 3 ? (
                      <Icon icon="lucide:check-circle" className="text-primary text-xl" />
                    ) : (
                      <Icon icon="line-md:loading-twotone-loop" className="text-primary text-xl" />
                    )
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></span>
                  )}
                </div>
                <span className={`text-[13.5px] font-medium ${applyStep === 3 ? 'text-primary' : applyStep > 3 ? 'text-foreground/75' : 'text-muted-foreground'}`}>
                  Tailoring AI custom answers in your voice...
                </span>
              </div>

              {/* Step 4: Autofill Page snap */}
              <div className="flex items-center gap-3">
                <div className="flex-none w-6 h-6 rounded-full flex items-center justify-center">
                  {applyStep >= 4 ? (
                    applyStep > 4 ? (
                      <Icon icon="lucide:check-circle" className="text-primary text-xl" />
                    ) : (
                      <Icon icon="line-md:loading-twotone-loop" className="text-primary text-xl" />
                    )
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></span>
                  )}
                </div>
                <span className={`text-[13.5px] font-medium ${applyStep === 4 ? 'text-primary' : applyStep > 4 ? 'text-foreground/75' : 'text-muted-foreground'}`}>
                  Autofilling application form inputs...
                </span>
              </div>

              {/* Step 5: Success screen */}
              {applyStep === 5 && (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mt-6 animate-[scaleUp_0.3s_ease-out] text-center">
                  <Icon icon="lucide:party-popper" className="text-primary text-3xl mx-auto mb-2" />
                  <h4 className="font-semibold text-[15px] text-primary">Autofill Complete!</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    The extension has successfully filled all fields of the form in your browser. 
                    <br/><strong>You review every field and click Submit.</strong>
                  </p>
                  <button 
                    onClick={closeApplyModal}
                    className="mt-4 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
                  >
                    Close & Review Form
                  </button>
                </div>
              )}

              {/* Progress bar */}
              {applyStep < 5 && (
                <div className="w-full bg-muted rounded-full h-1.5 mt-8 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(applyStep / 4) * 100}%` }}
                  ></div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobsInternships;
