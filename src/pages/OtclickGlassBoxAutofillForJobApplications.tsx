import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

// --- TYPES & INTERFACES ---

interface PipelineStage {
  id: number;
  title: string;
  description: string;
  cards: {
    type: 'main' | 'filters' | 'ban-risk';
    tag: string;
    heading: string;
    content: React.ReactNode;
  }[];
}

interface FaqItem {
  question: string;
  answer: string;
}

// --- HELPER SUB-COMPONENTS ---

const Hero: React.FC<{
  isVideoPlaying: boolean;
  onPlayVideo: () => void;
}> = ({ isVideoPlaying, onPlayVideo }) => {
  return (
    <header className="relative pt-24 pb-24 overflow-hidden bg-background text-foreground transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative z-10 max-w-[1152px] mx-auto px-6">
        <div className="transition-[opacity,transform] duration-[0.8s] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 translate-y-0">
          <h1 className="font-sans font-semibold text-[clamp(36px,4.6vw,60px)] leading-[1.02] tracking-[-0.03em] m-0 max-w-[28ch] text-balance text-foreground text-left">
            Your <span className="font-serif italic font-medium text-primary">job finder</span> for the<br className="hidden md:inline" /> next step in your career
          </h1>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 translate-y-0">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-12 items-start mt-8 max-md:grid-cols-1 max-md:gap-6 text-left">
            <p className="text-[16px] leading-[1.55] text-muted-foreground m-0 max-w-[640px] text-pretty">
              Explore active job postings and internships across top tech platforms. Filter by work mode, salary, and experience levels, and download free career templates.
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap">
                <Link
                  className="inline-flex items-center justify-center font-semibold tracking-[-0.01em] rounded-lg cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-md px-5 py-3 text-[14.5px] gap-2.5"
                  to="/jobs"
                >
                  Browse opportunities
                </Link>
                <a
                  className="inline-flex items-center justify-center font-semibold tracking-[-0.01em] rounded-lg cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border border-border hover:border-foreground hover:bg-muted px-5 py-3 text-[14.5px] gap-2.5"
                  href="#how"
                >
                  Learn how it works
                </a>
              </div>
              <div className="text-[13px] text-muted-foreground/80">
                100% free for job seekers — no sign-up required.
              </div>
            </div>
          </div>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 translate-y-0">
          <div className="mt-5 flex items-center gap-3.5 flex-wrap text-[13px] text-muted-foreground/80 justify-start">
            <span className="text-muted-foreground">Features</span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:search" className="text-[14px]" />
              Advanced Job Board
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:download" className="text-[14px]" />
              Careers Resources
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:book-open" className="text-[14px]" />
              Specialized Blogs
            </span>
          </div>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 translate-y-0">
          <div className="mt-14 w-full relative">
            <div className="absolute inset-0 rounded-2xl shadow-xl pointer-events-none"></div>
            <div className="relative w-full h-auto aspect-video block rounded-2xl overflow-hidden border border-muted-foreground/20 bg-black">
              {isVideoPlaying ? (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Q1clicks Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img
                    alt="Q1clicks dashboard demo"
                    className="object-cover w-full h-full opacity-90"
                    src="https://otclick.org/_next/image?url=%2Fscreenshots%2Fdashboard-hero-poster.jpg&w=1080&q=75"
                  />
                  <button
                    type="button"
                    onClick={onPlayVideo}
                    aria-label="Play Q1clicks demo"
                    className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                  >
                    <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors"></span>
                    <span className="relative inline-flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-background/95 shadow-lg group-hover:bg-background group-hover:scale-105 transition-all">
                      <Icon icon="lucide:play" className="text-foreground text-[14px] fill-current" />
                      <span className="text-[14px] font-medium text-foreground tracking-[-0.01em]">Play demo</span>
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Marquee: React.FC = () => {
  const platforms = [
    "LinkedIn", "Greenhouse", "Lever", "Workday", "Workable", "Ashby",
    "SmartRecruiters", "iCIMS", "Google", "Apple", "Meta", "Amazon",
    "Netflix", "Microsoft", "Salesforce", "Stripe", "Oracle", "Tesla",
    "Spotify", "OpenAI"
  ];

  return (
    <section className="bg-background text-foreground py-14 md:py-20 overflow-hidden transition-colors duration-300">
      <div className="max-w-[1152px] mx-auto px-5 md:px-12">
        <p className="text-center font-mono text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground/70 mb-6 md:mb-8">
          Aggregating roles across 1000+ companies
        </p>

        <div className="relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-background after:to-transparent">
          <div className="flex w-max gap-14 animate-[marquee_40s_linear_infinite]">
            <div className="flex shrink-0 items-center gap-14">
              {platforms.map((p, idx) => (
                <span key={idx} className="font-sans font-semibold whitespace-nowrap text-base md:text-lg tracking-tight text-foreground/60">
                  {p}
                </span>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-14" aria-hidden="true">
              {platforms.map((p, idx) => (
                <span key={`dup-${idx}`} className="font-sans font-semibold whitespace-nowrap text-base md:text-lg tracking-tight text-foreground/60">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PipelineTabs: React.FC<{
  activeStage: number;
  onSelectStage: (stageId: number) => void;
}> = ({ activeStage, onSelectStage }) => {
  const stages: PipelineStage[] = [
    {
      id: 1,
      title: "Discover",
      description: "Browse curated jobs and internships with specific filters, locations, and experience tags.",
      cards: [
        {
          type: 'main',
          tag: "01 · head start",
          heading: "Locate hand-picked roles matching your field.",
          content: (
            <div className="flex flex-col gap-3.5 p-4 rounded-[10px] bg-muted/40 border border-border/40">
              <div>
                <div className="flex items-center gap-3 -mx-2 px-2 py-1 rounded-[8px] transition-colors duration-500">
                  <span className="w-8 h-8 rounded-lg bg-purple-600 text-white grid place-items-center text-[11px] font-semibold flex-none">L</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate">Frontend Engineering Intern</div>
                    <div className="text-[10.5px] truncate flex items-center gap-1.5 text-muted-foreground/70">
                      <span className="font-medium text-inherit">Linear</span>·Remote · US
                    </div>
                  </div>
                  <button type="button" className="text-[11px] font-semibold flex-none px-2.5 py-1 rounded-md cursor-pointer transition-colors bg-primary text-primary-foreground hover:bg-primary/90">View</button>
                </div>
                <div className="h-px bg-border/40 mt-3.5"></div>
              </div>
              <div>
                <div className="flex items-center gap-3 -mx-2 px-2 py-1 rounded-[8px] transition-colors duration-500 bg-primary/10">
                  <span className="w-8 h-8 rounded-lg bg-amber-600 text-white grid place-items-center text-[11px] font-semibold flex-none scale-110">R</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate">Product Design Intern</div>
                    <div className="text-[10.5px] truncate flex items-center gap-1.5 text-muted-foreground/70">
                      <span className="font-medium text-inherit">Ramp</span>·New York, NY
                    </div>
                  </div>
                  <button type="button" className="text-[11px] font-semibold flex-none px-2.5 py-1 rounded-md cursor-pointer transition-colors bg-primary text-primary-foreground hover:bg-primary/90">View</button>
                </div>
                <div className="h-px bg-border/40 mt-3.5"></div>
              </div>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · filters",
          heading: "Filters that fit your criteria.",
          content: (
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer border bg-primary text-primary-foreground border-primary">Remote</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer border bg-primary text-primary-foreground border-primary">Internship</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer border bg-muted border-transparent text-muted-foreground">$50/hr+</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer border bg-primary text-primary-foreground border-primary">Engineering</button>
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · direct",
          heading: "Connect directly with hiring boards.",
          content: (
            <div className="flex flex-col gap-3.5 p-3 rounded-[10px] bg-muted/40 border border-border/40">
              <div className="flex items-center gap-1.5">
                <Icon icon="lucide:external-link" className="text-primary text-xs" />
                <span className="flex-1 text-[10.5px] font-mono truncate text-muted-foreground/70">linear.app/careers/apply</span>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 2,
      title: "Evaluate",
      description: "Inspect comprehensive metadata sheets highlighting location, work modes, and salary bands.",
      cards: [
        {
          type: 'main',
          tag: "01 · details panel",
          heading: "Analyze structured specifications.",
          content: (
            <div className="flex flex-col gap-3 p-4 rounded-[10px] bg-muted/40 border border-border/40 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Specifications</span>
                <span className="text-primary font-bold">Details</span>
              </div>
              <div className="text-[11px] text-muted-foreground space-y-1">
                <p><strong>Experience:</strong> 0-1 Years</p>
                <p><strong>Work Mode:</strong> Hybrid</p>
                <p><strong>Salary Range:</strong> $45 - $65 / hr</p>
              </div>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · categories",
          heading: "Curated tags.",
          content: (
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full border bg-primary text-primary-foreground border-primary">Engineering</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full border bg-muted border-transparent text-muted-foreground">Product</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full border bg-muted border-transparent text-muted-foreground">Marketing</button>
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · deadline",
          heading: "Track deadlines.",
          content: (
            <div className="flex items-center gap-2 p-2 rounded bg-card border border-border/40">
              <Icon icon="lucide:calendar-clock" className="text-primary text-lg" />
              <span className="text-xs font-mono text-muted-foreground">Apply before July 31</span>
            </div>
          )
        }
      ]
    },
    {
      id: 3,
      title: "Resources",
      description: "Download verified CV templates, interview cheat sheets, and guidelines for your process.",
      cards: [
        {
          type: 'main',
          tag: "01 · assets",
          heading: "Acquire templates for design & formatting layouts.",
          content: (
            <div className="flex flex-col gap-2.5 p-4 rounded-[10px] bg-muted/40 border border-border/40 text-left">
              <div className="flex justify-between text-xs border-b border-border/30 pb-1.5">
                <span className="text-muted-foreground">Asset Title</span>
                <span className="font-semibold text-foreground">Clean CV Template</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold text-primary">Templates</span>
              </div>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · category types",
          heading: "Curated PDF collections.",
          content: (
            <div className="p-2 rounded bg-card border border-border/40 text-[11px] text-muted-foreground text-left">
              Includes "Resume Builder Guide" and "Engineering Interview Prep Notes".
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · download",
          heading: "Direct PDF download.",
          content: (
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <Icon icon="lucide:download-cloud" />
              <span>Clean formats, secure files</span>
            </div>
          )
        }
      ]
    },
    {
      id: 4,
      title: "Learn",
      description: "Read specialized guides and blogs written by recruiters to prepare for interviews.",
      cards: [
        {
          type: 'main',
          tag: "01 · blogs",
          heading: "Prepare your profile strategy.",
          content: (
            <div className="flex flex-col gap-2 p-3 rounded-[10px] bg-muted/40 border border-border/40 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Writeup</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">New Post</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug m-0">"How to structure dynamic layouts for recruiters."</p>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · tips",
          heading: "Actionable summaries.",
          content: (
            <div className="flex items-center gap-4 text-left">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">Expert Advice</div>
                <div className="text-sm font-bold text-primary">Interview prep guides</div>
              </div>
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · updates",
          heading: "Weekly new articles.",
          content: (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon icon="lucide:check-circle" className="text-primary" />
              <span>Published regularly</span>
            </div>
          )
        }
      ]
    }
  ];

  const currentStage = stages.find(s => s.id === activeStage) || stages[0];

  return (
    <section id="how" className="relative bg-background text-foreground py-16 px-4 md:px-8 lg:px-16 max-w-[1120px] mx-auto transition-colors duration-300">
      <div className="w-full">
        <div className="mb-10 text-left">
          <span className="inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none"></span>
            The platform.
          </span>
          <h2 className="font-sans font-semibold text-3xl md:text-4xl lg:text-[40px] leading-tight tracking-[-0.015em] m-0 max-w-[760px] text-balance text-foreground">
            Four pillars. One directory. Hand-curated opportunities.
          </h2>
        </div>

        <div role="tablist" aria-label="Pipeline stages" className="flex items-stretch gap-0 w-full max-md:flex-wrap max-md:gap-2 justify-start">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div className="contents max-md:contents">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeStage === stage.id}
                  onClick={() => onSelectStage(stage.id)}
                  className={`inline-flex items-center gap-2.5 rounded-full border px-[18px] py-2.5 cursor-pointer transition-all duration-300 ${
                    activeStage === stage.id
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground"
                  }`}
                >
                  <span className="font-mono text-[10.5px] tracking-[0.08em] tabular-nums opacity-65">
                    0{stage.id}
                  </span>
                  <span className="text-[14px] font-semibold tracking-[-0.005em]">{stage.title}</span>
                </button>
                {index < stages.length - 1 && (
                  <span className="w-8 flex-none border-t border-dashed border-border/80 self-center max-md:hidden"></span>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-8 border border-border bg-card rounded-2xl p-8 max-md:p-5 overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-[400%]"
            style={{ transform: `translateX(-${(activeStage - 1) * 25}%)` }}
          >
            {stages.map(stage => (
              <div key={stage.id} className="w-1/4 shrink-0 flex gap-8 items-stretch max-md:flex-col text-left">
                {/* Description column */}
                <div className="flex-1 flex flex-col justify-between max-md:gap-4 pr-4">
                  <div>
                    <span className="font-mono text-[12px] tracking-[0.08em] uppercase text-muted-foreground block mb-2">
                      Stage 0{stage.id} — {stage.title}
                    </span>
                    <p className="text-[15px] leading-[1.55] text-muted-foreground m-0 max-w-[480px]">
                      {stage.description}
                    </p>
                  </div>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mt-6 text-sm no-underline font-semibold"
                  >
                    Get started <Icon icon="lucide:arrow-right" />
                  </Link>
                </div>

                {/* Cards column */}
                <div className="grid grid-cols-[1fr_minmax(0,180px)] grid-rows-2 gap-4 flex-1 max-md:grid-cols-1 max-md:grid-rows-none max-md:gap-3">
                  {stage.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className={`rounded-[14px] border border-border p-5 flex flex-col justify-between gap-4 transition-colors ${
                        card.type === 'main'
                          ? 'col-span-1 row-span-2 bg-muted/20 animate-[fadeIn_0.3s_ease-out]'
                          : 'bg-card text-foreground animate-[fadeIn_0.3s_ease-out]'
                      }`}
                    >
                      <div className="space-y-2">
                        <span className="font-mono text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase block">
                          {card.tag}
                        </span>
                        <h4 className="font-display font-semibold text-[15px] tracking-tight leading-tight m-0 text-foreground">
                          {card.heading}
                        </h4>
                      </div>
                      <div>{card.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PlatformSurfaces: React.FC = () => {
  return (
    <section id="platforms" className="py-24 scroll-mt-16 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-[1152px] mx-auto px-12 max-md:px-6 text-left">
        <span className="inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3">
          Explore the portal.
        </span>
        <h2 className="font-display font-semibold text-[clamp(24px,2.6vw,32px)] tracking-[-0.02em] m-0 max-w-[720px] text-foreground">
          One system. Three pillars.
        </h2>

        <div className="mt-12 grid grid-cols-3 max-lg:grid-cols-1 border-t border-l border-border">
          {/* Surface 1: Jobs Board */}
          <article className="flex flex-col gap-4 p-8 border-r border-b border-border">
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
              01 – jobs board
            </span>
            <h3 className="font-display font-semibold text-[clamp(22px,2.2vw,26px)] tracking-[-0.01em] m-0 text-foreground">
              Explore opportunities.
            </h3>
            <p className="text-[14px] leading-[1.55] text-muted-foreground m-0 max-w-[460px]">
              Browse structured tech job listings and internships. No clutter, no popups — just opportunities.
            </p>

            <div className="mt-1">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 overflow-hidden">
                <div className="flex items-center gap-1.5 pb-2.5 border-b border-border">
                  <span className="w-[7px] h-[7px] rounded-full bg-emerald-500"></span>
                  <span className="flex-1 rounded-full text-[10px] text-muted-foreground truncate font-mono">
                    q1clicks.com/jobs
                  </span>
                </div>
                <div className="mt-3 p-2.5 rounded-[10px] bg-foreground text-background flex items-center gap-2.5">
                  <span className="w-[18px] h-[18px] rounded bg-emerald-500 flex-none"></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium">Job listings active</div>
                    <div className="text-[10px] text-background/65 mt-0.5">Filter by skills and pay</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2">
              <Link
                className="inline-flex items-center justify-center font-display font-semibold tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted px-3.5 py-2 text-[13px] gap-2"
                to="/jobs"
              >
                Go to listings <Icon icon="lucide:arrow-right" className="text-[14px]" />
              </Link>
            </div>
          </article>

          {/* Surface 2: Resources */}
          <article className="flex flex-col gap-4 p-8 border-r border-b border-border">
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
              02 – resources
            </span>
            <h3 className="font-display font-semibold text-[clamp(22px,2.2vw,26px)] tracking-[-0.01em] m-0 text-foreground">
              Download templates.
            </h3>
            <p className="text-[14px] leading-[1.55] text-muted-foreground m-0 max-w-[460px]">
              Hand-picked CV formatting templates, guides, and career cheat sheets designed to give you an edge.
            </p>

            <div className="mt-1">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 overflow-hidden">
                <div className="flex items-center gap-2 pb-2.5 border-b border-border">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-700"></span>
                  <span className="text-[11px] font-medium text-foreground">Downloads library</span>
                </div>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <Icon icon="lucide:file-text" className="text-primary text-xs" />
                    <span className="flex-1 font-mono">Clean CV Template.pdf</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <Icon icon="lucide:file-text" className="text-primary text-xs" />
                    <span className="flex-1 font-mono">Interview Prep.pdf</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2">
              <Link
                className="inline-flex items-center justify-center font-display font-semibold tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted px-3.5 py-2 text-[13px] gap-2"
                to="/about"
              >
                Explore library <Icon icon="lucide:arrow-right" className="text-[14px]" />
              </Link>
            </div>
          </article>

          {/* Surface 3: Admin Console */}
          <article className="flex flex-col gap-4 p-8 border-r border-b border-border">
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
              03 – console
            </span>
            <h3 className="font-display font-semibold text-[clamp(22px,2.2vw,26px)] tracking-[-0.01em] m-0 text-foreground">
              Publishing console.
            </h3>
            <p className="text-[14px] leading-[1.55] text-muted-foreground m-0 max-w-[460px]">
              A dedicated console for coordinators to securely publish opportunities, manage media, and add categories.
            </p>

            <div className="mt-1">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 overflow-hidden">
                <div className="flex items-center justify-center pb-2.5 border-b border-border text-[11px] text-muted-foreground font-semibold">
                  Secure Admin Session
                </div>
                <div className="pt-3 flex flex-col gap-2">
                  <div className="text-[11px] text-muted-foreground leading-[1.4] p-2 rounded-[8px] bg-card border border-border/50 font-semibold text-center">
                    Dashboard authorized
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2">
              <Link
                className="inline-flex items-center justify-center font-display font-semibold tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted px-3.5 py-2 text-[13px] gap-2"
                to="/admin"
              >
                Open dashboard <Icon icon="lucide:arrow-right" className="text-[14px]" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="bg-background text-foreground py-16 transition-colors duration-300">
      <div className="max-w-[1152px] mx-auto px-12 max-md:px-6 text-left">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
          <div className="flex flex-col gap-3">
            <h2 className="font-display font-semibold text-[clamp(28px,3vw,36px)] tracking-[-0.02em] m-0 max-w-[720px] text-foreground">
              Always free for job seekers.
            </h2>
            <span className="text-[14px] text-muted-foreground">
              Browse job listings, read helpful career articles, and download template guides completely free.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 mb-4">
          {/* Free Card */}
          <article className="rounded-[16px] border border-border bg-card text-card-foreground p-7 flex flex-col gap-6">
            <header>
              <span className="font-mono text-[13px] tracking-[0.06em] text-muted-foreground uppercase">Job Seekers</span>
            </header>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-normal text-[56px] leading-none tracking-[-0.02em] tabular-nums text-foreground">$0</span>
                <span className="text-[14px] text-muted-foreground">forever</span>
              </div>
              <p className="text-[14px] m-0 text-muted-foreground">Access all vacancies and downloads.</p>
            </div>
            <div className="h-px bg-border"></div>
            <ul className="flex flex-col gap-2.5 flex-1">
              <li className="text-[13.5px] text-muted-foreground leading-snug">Unlimited job search queries</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">Detailed job specification sheets</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">Salary & experience filtration</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">Downloadable CV & resume PDFs</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">Career blogs & recruiting guides</li>
            </ul>
            <Link
              className="inline-flex items-center justify-center font-display font-semibold tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-emerald-600 text-primary-foreground border-transparent hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md px-5 py-3 text-[14.5px] gap-2.5 w-full"
              to="/jobs"
            >
              Start browsing now
            </Link>
          </article>

          {/* Admin Card */}
          <article className="relative rounded-[16px] border border-transparent bg-neutral-900 text-neutral-100 shadow-lg p-7 flex flex-col gap-6">
            <header className="flex items-center justify-between gap-3">
              <span className="font-mono text-[13px] tracking-[0.06em] text-neutral-300">Coordinators & Admins</span>
            </header>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-normal text-[56px] leading-none tracking-[-0.02em] tabular-nums text-primary-foreground">Secure</span>
              </div>
              <p className="text-[14px] m-0 text-neutral-400">Authenticated dashboard for data curation.</p>
            </div>
            <div className="h-px bg-neutral-800"></div>
            <ul className="flex flex-col gap-2.5 flex-1">
              <li className="text-[13.5px] text-neutral-300 leading-snug">Create and manage companies</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">Post and edit job vacancies</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">Upload media logs & assets</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">Write & publish career blogs</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">Supabase database integration</li>
            </ul>
            <Link
              className="inline-flex items-center justify-center font-display font-semibold tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-primary-foreground border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 px-5 py-3 text-[14.5px] gap-2.5 w-full"
              to="/admin"
            >
              Access admin panel
            </Link>
          </article>
        </div>

        <div className="mt-6 grid grid-cols-3 max-md:grid-cols-1 border border-border rounded-[16px] bg-card overflow-hidden">
          <div className="px-6 py-5 flex flex-col gap-1 border-r border-border last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
            <span className="text-[14px] font-semibold text-foreground">Free Forever</span>
            <span className="text-[13px] text-muted-foreground">Access all vacancies without account requirements.</span>
          </div>
          <div className="px-6 py-5 flex flex-col gap-1 border-r border-border last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
            <span className="text-[14px] font-semibold text-foreground">No Hidden Fees</span>
            <span className="text-[13px] text-muted-foreground">All resource templates are free to download.</span>
          </div>
          <div className="px-6 py-5 flex flex-col gap-1 border-r border-border last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
            <span className="text-[14px] font-semibold text-foreground">Verified Direct Links</span>
            <span className="text-[13px] text-muted-foreground">Job posts link directly to company ATS setups.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ: React.FC<{
  activeFaqIndex: number | null;
  onToggleFaq: (index: number) => void;
}> = ({ activeFaqIndex, onToggleFaq }) => {
  const faqs: FaqItem[] = [
    {
      question: "Are the job listings on Q1clicks verified?",
      answer: "Yes. All vacancies are curated and checked by our coordinators, linking directly to the official company hiring page."
    },
    {
      question: "Is Q1clicks free to use for job seekers?",
      answer: "Yes, 100% free. We do not charge subscription fees, hide information behind paywalls, or require credit cards."
    },
    {
      question: "How can I apply to a job vacancy?",
      answer: "Simply click on the job card to view the detailed specifications, then click 'Apply Now' to go directly to the company's application form."
    },
    {
      question: "Can I download templates directly?",
      answer: "Yes. All resume formats, CV templates, and interview cheat sheets in our resources tab are downloadable as clean PDFs."
    },
    {
      question: "How do I add a new job listing?",
      answer: "Listing creation is restricted to coordinators. Authorized admins can sign in at /admin to manage opportunities."
    }
  ];

  return (
    <section id="faq" className="bg-background text-foreground py-16 md:py-20 transition-colors duration-300">
      <div className="max-w-[1180px] mx-auto px-8 text-left">
        <div className="opacity-100 translate-y-0 transition-all duration-700">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-[52px] leading-[1.04] tracking-tight m-0 max-w-[20ch] text-balance">
              The things people ask first.
            </h2>
          </div>
        </div>

        <div className="opacity-100 translate-y-0 transition-all duration-700 delay-100">
          <div className="max-w-[820px] mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div key={index} className="border-t border-border last:border-b">
                  <button
                    onClick={() => onToggleFaq(index)}
                    className="w-full cursor-pointer py-[26px] pr-2 flex items-center justify-between gap-6 text-xl font-medium tracking-tight text-left bg-transparent border-none text-foreground"
                  >
                    <span className="flex-1">{faq.question}</span>
                    <span className="relative w-5 h-5 flex-none text-primary flex items-center justify-center">
                      <Icon icon={isOpen ? "lucide:minus" : "lucide:plus"} className="text-xl" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-7 pr-[60px] text-muted-foreground text-[16.5px] leading-[1.6] max-w-[64ch]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC = () => {
  return (
    <section id="start" className="relative overflow-hidden bg-primary text-primary-foreground py-20 md:py-28 text-left">
      <span className="absolute -top-[260px] -right-[160px] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.35),transparent_64%)] blur-[24px] pointer-events-none"></span>

      <div className="relative z-10 max-w-[1152px] mx-auto px-12 max-md:px-6 flex flex-col items-start gap-8">
        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <span className="inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-primary-foreground/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none"></span>
            No account required. Free forever.
          </span>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <h2 className="font-sans font-semibold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight m-0 max-w-[20ch] text-balance">
            Find your next tech role today –<span className="font-serif italic font-medium text-teal-300">direct applications.</span>
          </h2>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <div className="flex gap-2.5 flex-wrap">
            <Link
              className="inline-flex items-center justify-center font-sans font-semibold tracking-tight rounded-lg cursor-pointer transition-all duration-200 ease-out whitespace-nowrap no-underline bg-emerald-600 text-primary-foreground hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg px-6 py-3.5 text-[15px] gap-2.5"
              to="/jobs"
            >
              Browse vacancies now
              <Icon icon="lucide:arrow-right" className="text-base" />
            </Link>
          </div>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <p className="font-mono text-[11.5px] tracking-wider text-primary-foreground/50 m-0">
            Free careers platform · direct links to hiring portals
          </p>
        </div>
      </div>
    </section>
  );
};

const OtclickGlassBoxAutofillForJobApplications: React.FC = () => {
  const [activePipelineStage, setActivePipelineStage] = useState<number>(1);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);

  // Auto-slide effect that advances stage every 4.5 seconds
  // Resets timer if the user manually clicks any stage button
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePipelineStage(prev => (prev === 4 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [clickCount]);

  const playDemoVideo = () => {
    setIsVideoPlaying(true);
  };

  const selectPipelineStage = (stageId: number) => {
    setActivePipelineStage(stageId);
    setClickCount(prev => prev + 1); // Reset timer
  };

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(prev => (prev === index ? null : index));
  };

  return (
    <>
      <Hero isVideoPlaying={isVideoPlaying} onPlayVideo={playDemoVideo} />
      <Marquee />
      <PipelineTabs activeStage={activePipelineStage} onSelectStage={selectPipelineStage} />
      <PlatformSurfaces />
      <Pricing />
      <FAQ activeFaqIndex={activeFaqIndex} onToggleFaq={toggleFaq} />
      <CTASection />
    </>
  );
};

export default OtclickGlassBoxAutofillForJobApplications;