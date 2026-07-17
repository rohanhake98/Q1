import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

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
          <h1 className="font-sans font-semibold text-[clamp(36px,4.6vw,60px)] leading-[1.02] tracking-[-0.03em] m-0 max-w-[28ch] text-balance text-foreground">
            Your <span class="font-serif italic font-medium text-primary">AI copilot</span> for the<br className="hidden md:inline" /> entire job applying process
          </h1>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 translate-y-0">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-12 items-start mt-8 max-md:grid-cols-1 max-md:gap-6">
            <p className="text-[16px] leading-[1.55] text-muted-foreground m-0 max-w-[640px] text-pretty">
              Autofill any application in seconds, review every field, and click Submit yourself – from one-click fill to inbox tracking, one extension handles the busywork.
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap">
                <a
                  className="inline-flex items-center justify-center font-medium tracking-[-0.01em] rounded-lg cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-md px-5 py-3 text-[14.5px] gap-2.5"
                  href="#start"
                >
                  Start applying – free
                </a>
                <a
                  className="inline-flex items-center justify-center font-medium tracking-[-0.01em] rounded-lg cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border border-border hover:border-foreground hover:bg-muted px-5 py-3 text-[14.5px] gap-2.5"
                  href="#how"
                >
                  See how it works
                </a>
              </div>
              <div className="text-[13px] text-muted-foreground/80">
                Free to start – no card required.
              </div>
            </div>
          </div>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-[cubic-bezier(.2,.8,.2,1)] opacity-100 translate-y-0">
          <div className="mt-5 flex items-center gap-3.5 flex-wrap text-[13px] text-muted-foreground/80">
            <span class="text-muted-foreground">Works across</span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:chrome" className="text-[14px]" />
              Chrome extension
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:layout-dashboard" className="text-[14px]" />
              Web dashboard
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="lucide:mail" className="text-[14px]" />
              Gmail inbox
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
                    aria-label="Play Q1clicks dashboard demo"
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
          Supports 1000+ platforms and more
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
      description: "Browse remote jobs with filters that fit you, then open the actual company/ATS form in a tab – ready for the extension.",
      cards: [
        {
          type: 'main',
          tag: "01 · head start",
          heading: "Browse roles that fit you, then open the real form.",
          content: (
            <div className="flex flex-col gap-3.5 p-4 rounded-[10px] bg-muted/40 border border-border/40">
              <div>
                <div className="flex items-center gap-3 -mx-2 px-2 py-1 rounded-[8px] transition-colors duration-500">
                  <span className="w-8 h-8 rounded-lg bg-muted grid place-items-center text-[11px] font-semibold flex-none">L</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate">Senior Frontend Engineer</div>
                    <div className="text-[10.5px] truncate flex items-center gap-1.5 text-muted-foreground/70">
                      <span className="font-medium text-inherit">Linear</span>·Remote · US
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono tracking-[0.04em] uppercase rounded-full px-2 py-0.5 flex-none border text-primary border-primary/40">Ashby</span>
                  <button type="button" className="text-[11px] font-semibold flex-none px-2.5 py-1 rounded-md cursor-pointer transition-colors bg-primary text-primary-foreground hover:bg-primary/90">Apply</button>
                </div>
                <div className="h-px bg-border/40 mt-3.5"></div>
              </div>
              <div>
                <div className="flex items-center gap-3 -mx-2 px-2 py-1 rounded-[8px] transition-colors duration-500 bg-primary/10">
                  <span className="w-8 h-8 rounded-lg bg-muted grid place-items-center text-[11px] font-semibold flex-none scale-110">R</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate">Product Engineer</div>
                    <div className="text-[10.5px] truncate flex items-center gap-1.5 text-muted-foreground/70">
                      <span className="font-medium text-inherit">Ramp</span>·Remote · US
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono tracking-[0.04em] uppercase rounded-full px-2 py-0.5 flex-none border text-primary-foreground bg-primary border-primary">Greenhouse</span>
                  <button type="button" className="text-[11px] font-semibold flex-none px-2.5 py-1 rounded-md cursor-pointer transition-colors bg-primary text-primary-foreground hover:bg-primary/90">Apply</button>
                </div>
                <div className="h-px bg-border/40 mt-3.5"></div>
              </div>
              <div>
                <div className="flex items-center gap-3 -mx-2 px-2 py-1 rounded-[8px] transition-colors duration-500">
                  <span className="w-8 h-8 rounded-lg bg-muted grid place-items-center text-[11px] font-semibold flex-none">N</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium truncate">Backend Engineer</div>
                    <div className="text-[10.5px] truncate flex items-center gap-1.5 text-muted-foreground/70">
                      <span className="font-medium text-inherit">Notion</span>·San Francisco
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono tracking-[0.04em] uppercase rounded-full px-2 py-0.5 flex-none border text-primary border-primary/40">Lever</span>
                  <button type="button" className="text-[11px] font-semibold flex-none px-2.5 py-1 rounded-md cursor-pointer transition-colors bg-primary text-primary-foreground hover:bg-primary/90">Apply</button>
                </div>
              </div>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · filters",
          heading: "Filters that fit you.",
          content: (
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer transition-colors border bg-primary text-primary-foreground border-primary">Remote</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer transition-colors border bg-primary text-primary-foreground border-primary">Senior</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer transition-colors border bg-muted border-transparent text-muted-foreground hover:bg-muted/80">$160k+</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer transition-colors border bg-primary text-primary-foreground border-primary">Frontend</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer transition-colors border bg-muted border-transparent text-muted-foreground hover:bg-muted/80">US</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full cursor-pointer transition-colors border bg-primary text-primary-foreground border-primary">Full-time</button>
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · zero ban risk",
          heading: "Opens the real ATS in a tab.",
          content: (
            <div className="flex flex-col gap-3.5 p-3 rounded-[10px] bg-muted/40 border border-border/40">
              <div className="flex items-center gap-1.5">
                <span className="flex gap-1">
                  <span className="w-[6px] h-[6px] rounded-full bg-destructive"></span>
                  <span className="w-[6px] h-[6px] rounded-full bg-amber-500"></span>
                  <span className="w-[6px] h-[6px] rounded-full bg-primary"></span>
                </span>
                <span className="flex-1 text-[10px] font-mono truncate text-muted-foreground/70">boards.greenhouse.io/acme/jobs/4729</span>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 2,
      title: "Tailor",
      description: "Instantly align your resume and cover letter keywords to the job description with smart AI suggestions.",
      cards: [
        {
          type: 'main',
          tag: "01 · resume match",
          heading: "Optimize your resume for ATS scanners in real-time.",
          content: (
            <div className="flex flex-col gap-3 p-4 rounded-[10px] bg-muted/40 border border-border/40">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">ATS Match Score</span>
                <span className="text-emerald-600 font-bold">92%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-[11px] text-muted-foreground">Added keywords: "React Native", "CI/CD Pipelines", "System Architecture"</p>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · tone",
          heading: "Adjust tone and style.",
          content: (
            <div className="flex flex-wrap gap-1.5">
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full border bg-primary text-primary-foreground border-primary">Professional</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full border bg-muted border-transparent text-muted-foreground">Confident</button>
              <button type="button" className="text-[11px] font-mono px-2 py-1 rounded-full border bg-muted border-transparent text-muted-foreground">Casual</button>
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · export",
          heading: "Export tailored PDF.",
          content: (
            <div className="flex items-center gap-2 p-2 rounded bg-card border border-border/40">
              <Icon icon="lucide:file-text" className="text-primary text-lg" />
              <span className="text-xs font-mono text-muted-foreground">Resume_Tailored.pdf</span>
            </div>
          )
        }
      ]
    },
    {
      id: 3,
      title: "Fill",
      description: "The extension automatically detects form fields and populates them with your verified profile data.",
      cards: [
        {
          type: 'main',
          tag: "01 · autofill",
          heading: "One-click fill for all standard and custom questions.",
          content: (
            <div className="flex flex-col gap-2.5 p-4 rounded-[10px] bg-muted/40 border border-border/40">
              <div className="flex justify-between text-xs border-b border-border/30 pb-1.5">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium">Alex Rivera</span>
              </div>
              <div className="flex justify-between text-xs border-b border-border/30 pb-1.5">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">alex@rivera.dev</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">LinkedIn</span>
                <span className="font-medium text-primary">linkedin.com/in/alexr</span>
              </div>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · custom fields",
          heading: "Handles complex prompts.",
          content: (
            <div className="p-2 rounded bg-card border border-border/40 text-[11px] text-muted-foreground">
              "Why do you want to join?" filled with tailored 150-word response.
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · safety",
          heading: "You click submit.",
          content: (
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <Icon icon="lucide:shield-check" />
              <span>100% safe from automated detection</span>
            </div>
          )
        }
      ]
    },
    {
      id: 4,
      title: "Track",
      description: "Keep tabs on every application automatically. Sync outcomes directly from your email inbox.",
      cards: [
        {
          type: 'main',
          tag: "01 · dashboard",
          heading: "Centralized tracking for all active applications.",
          content: (
            <div className="flex flex-col gap-2 p-3 rounded-[10px] bg-muted/40 border border-border/40">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Stripe</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Interview Scheduled</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Vercel</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Offer Received</span>
              </div>
            </div>
          )
        },
        {
          type: 'filters',
          tag: "02 · analytics",
          heading: "Conversion rates.",
          content: (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">24%</div>
                <div className="text-[9px] text-muted-foreground">Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">8</div>
                <div className="text-[9px] text-muted-foreground">Interviews</div>
              </div>
            </div>
          )
        },
        {
          type: 'ban-risk',
          tag: "03 · sync",
          heading: "Gmail auto-sync.",
          content: (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon icon="lucide:refresh-cw" className="animate-spin text-primary" />
              <span>Synced 2 mins ago</span>
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
        <div className="mb-10">
          <span className="inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none"></span>
            The pipeline.
          </span>
          <h2 className="font-sans font-semibold text-3xl md:text-4xl lg:text-[40px] leading-tight tracking-[-0.015em] m-0 max-w-[760px] text-balance text-foreground">
            Four stages. One extension. Zero auto-submits.
          </h2>
        </div>

        <div role="tablist" aria-label="Pipeline stages" className="flex items-stretch gap-0 w-full max-md:flex-wrap max-md:gap-2">
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
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground"
                  }`}
                >
                  <span className="font-mono text-[10.5px] tracking-[0.08em] tabular-nums opacity-65">
                    0{stage.id}
                  </span>
                  <span className="text-[14px] font-medium tracking-[-0.005em]">{stage.title}</span>
                </button>
                {index < stages.length - 1 && (
                  <div className="flex-1 self-center relative h-px bg-border mx-3 overflow-hidden max-md:hidden">
                    <div
                      className={`absolute inset-0 bg-primary origin-left transition-transform duration-500 ${
                        activeStage > stage.id ? "scale-x-100" : "scale-x-0 opacity-20"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-7 mb-6">
          <p className="m-0 text-[16px] leading-[1.5] text-muted-foreground max-w-[720px]">
            {currentStage.description}
          </p>
        </div>

        <div className="grid">
          <div className="transition-all duration-[0.42s] ease-[cubic-bezier(.2,.8,.2,1)]">
            <div className="grid grid-cols-3 grid-rows-2 gap-4 max-lg:grid-cols-1 max-lg:grid-rows-none">
              {currentStage.cards.map((card, idx) => {
                if (card.type === 'main') {
                  return (
                    <div key={idx} className="flex flex-col gap-3 p-6 rounded-2xl bg-card text-card-foreground overflow-hidden shadow-lg col-span-2 row-span-2 max-lg:col-span-1">
                      <span className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-muted-foreground/70">{card.tag}</span>
                      <div className="text-[17px] font-medium leading-[1.25] tracking-[-0.01em] max-w-[34ch]">{card.heading}</div>
                      <div className="mt-4 flex flex-col justify-end flex-1 min-h-0">
                        {card.content}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="flex flex-col gap-3 p-6 rounded-2xl bg-card text-card-foreground overflow-hidden shadow-lg">
                    <span className="font-mono text-[10.5px] tracking-[0.08em] uppercase text-muted-foreground/70">{card.tag}</span>
                    <div className="text-[17px] font-medium leading-[1.25] tracking-[-0.01em] max-w-[34ch]">{card.heading}</div>
                    <div className="mt-4 flex flex-col justify-end flex-1 min-h-0">
                      {card.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PlatformSurfaces: React.FC = () => {
  return (
    <section id="platforms" className="py-24 scroll-mt-16 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-[1152px] mx-auto px-12 max-md:px-6">
        <span className="inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3">
          Wherever you work.
        </span>
        <h2 className="font-display font-semibold text-[clamp(24px,2.6vw,32px)] tracking-[-0.02em] m-0 max-w-[720px] text-foreground">
          One product. Three surfaces.
        </h2>

        <div className="mt-12 grid grid-cols-3 max-lg:grid-cols-1 border-t border-l border-border">
          {/* Surface 1: Chrome */}
          <article className="flex flex-col gap-4 p-8 border-r border-b border-border">
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
              01 – chrome
            </span>
            <h3 className="font-display font-semibold text-[clamp(22px,2.2vw,26px)] tracking-[-0.01em] m-0 text-foreground">
              Fill from Chrome.
            </h3>
            <p className="text-[14px] leading-[1.55] text-muted-foreground m-0 max-w-[460px]">
              On any company or ATS application form, the Q1clicks toolbar drops in. One click fills every field – you review on the real page and submit.
            </p>

            <div className="mt-1">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 overflow-hidden">
                <div className="flex items-center gap-1.5 pb-2.5 border-b border-border">
                  <span className="flex gap-1">
                    <span className="w-[7px] h-[7px] rounded-full bg-destructive"></span>
                    <span className="w-[7px] h-[7px] rounded-full bg-[#FBBF24]"></span>
                    <span className="w-[7px] h-[7px] rounded-full bg-accent"></span>
                  </span>
                  <span className="flex-1 bg-card px-2 py-[3px] rounded-full text-[10px] text-muted-foreground truncate">
                    boards.greenhouse.io/acme/jobs/4729
                  </span>
                </div>
                <div className="mt-3 p-2.5 rounded-[10px] bg-foreground text-background flex items-center gap-2.5">
                  <span className="w-[18px] h-[18px] rounded bg-emerald-500 flex-none"></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium">Application form detected</div>
                    <div className="text-[10px] text-background/65 mt-0.5">6 fields · ready to fill</div>
                  </div>
                  <span className="bg-background text-foreground text-[10px] font-medium px-2.5 py-1 rounded-full">
                    Fill this page
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-display font-medium tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted px-3.5 py-2 text-[13px] gap-2"
                href="https://chromewebstore.google.com/detail/otclickus-autofill/iiadhkoapkhkjiohapmlhfmglnklcajl"
              >
                Add to Chrome <Icon icon="lucide:arrow-right" className="text-[14px]" />
              </a>
            </div>
          </article>

          {/* Surface 2: Web */}
          <article className="flex flex-col gap-4 p-8 border-r border-b border-border">
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
              02 – web
            </span>
            <h3 className="font-display font-semibold text-[clamp(22px,2.2vw,26px)] tracking-[-0.01em] m-0 text-foreground">
              Track on the web.
            </h3>
            <p className="text-[14px] leading-[1.55] text-muted-foreground m-0 max-w-[460px]">
              The companion dashboard: job discovery, profile and story, every filled application and its outcome – one truthful tracker, updated live.
            </p>

            <div className="mt-1">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 overflow-hidden">
                <div className="flex items-center gap-2 pb-2.5 border-b border-border">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-700"></span>
                  <span className="text-[11px] font-medium text-foreground">Tracker</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">12 applications</span>
                </div>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <span className="w-3.5 h-3.5 rounded bg-card border border-border"></span>
                    <span className="flex-1">Linear</span>
                    <span className="text-[10px] font-medium text-emerald-600">Ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <span className="w-3.5 h-3.5 rounded bg-card border border-border"></span>
                    <span className="flex-1">Ramp</span>
                    <span className="text-[10px] font-medium text-muted-foreground">Applied</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-foreground">
                    <span className="w-3.5 h-3.5 rounded bg-card border border-border"></span>
                    <span className="flex-1">Notion</span>
                    <span className="text-[10px] font-medium text-emerald-700">Interview</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2">
              <a
                className="inline-flex items-center justify-center font-display font-medium tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted px-3.5 py-2 text-[13px] gap-2"
                href="#start"
              >
                Open dashboard <Icon icon="lucide:arrow-right" className="text-[14px]" />
              </a>
            </div>
          </article>

          {/* Surface 3: Gmail */}
          <article className="flex flex-col gap-4 p-8 border-r border-b border-border">
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
              03 – gmail
            </span>
            <h3 className="font-display font-semibold text-[clamp(22px,2.2vw,26px)] tracking-[-0.01em] m-0 text-foreground">
              Outcomes from your inbox.
            </h3>
            <p className="text-[14px] leading-[1.55] text-muted-foreground m-0 max-w-[460px]">
              Connect Gmail read-only and recruiter replies classify themselves into outcomes – no sending, no mailbox creation, tokens encrypted at rest.
            </p>

            <div className="mt-1">
              <div className="rounded-xl border border-border bg-muted/40 p-3.5 overflow-hidden">
                <div className="flex items-center justify-center pb-2.5 border-b border-border text-[11px] text-muted-foreground">
                  Gmail · read-only
                </div>
                <div className="pt-3 flex flex-col gap-2">
                  <div className="text-[11px] text-muted-foreground leading-[1.4] p-2 rounded-[8px] bg-card border border-border/50">
                    “Thanks for applying – we'd love to schedule a call.”
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-none"></span>
                    <span className="font-mono text-muted-foreground truncate">sourcing@stripe.com</span>
                    <span className="ml-auto text-[10px] font-medium text-emerald-700">→ Interview</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2">
              <a
                className="inline-flex items-center justify-center font-display font-medium tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-foreground border-border hover:border-foreground hover:bg-muted px-3.5 py-2 text-[13px] gap-2"
                href="#start"
              >
                Connect Gmail <Icon icon="lucide:arrow-right" className="text-[14px]" />
              </a>
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
      <div className="max-w-[1152px] mx-auto px-12 max-md:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
          <div className="flex flex-col gap-3">
            <h2 className="font-display font-semibold text-[clamp(28px,3vw,36px)] tracking-[-0.02em] m-0 max-w-[720px] text-foreground">
              One plan. Pick your rhythm.
            </h2>
            <span className="text-[14px] text-muted-foreground">
              Free forever, or go unlimited – billed weekly, monthly, or quarterly.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 mb-4">
          {/* Free Card */}
          <article className="rounded-[16px] border border-border bg-card text-card-foreground p-7 flex flex-col gap-6">
            <header>
              <span className="font-mono text-[13px] tracking-[0.06em] text-muted-foreground uppercase">Free</span>
            </header>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-normal text-[56px] leading-none tracking-[-0.02em] tabular-nums text-foreground">$0</span>
                <span className="text-[14px] text-muted-foreground">forever</span>
              </div>
              <p className="text-[14px] m-0 text-muted-foreground">Everything you need to start applying.</p>
            </div>
            <div className="h-px bg-border"></div>
            <ul className="flex flex-col gap-2.5 flex-1">
              <li className="text-[13.5px] text-muted-foreground leading-snug">Application autofilling</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">Job search</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">1 resume upload</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">Advanced resume keyword analysis</li>
              <li className="text-[13.5px] text-muted-foreground leading-snug">Unlimited job tracking</li>
            </ul>
            <a
              className="inline-flex items-center justify-center font-display font-medium tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-emerald-600 text-primary-foreground border-transparent hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md px-5 py-3 text-[14.5px] gap-2.5 w-full"
              href="#start"
            >
              Start free
            </a>
          </article>

          {/* Unlimited Card */}
          <article className="relative rounded-[16px] border border-transparent bg-neutral-900 text-neutral-100 shadow-lg p-7 flex flex-col gap-6">
            <header className="flex items-center justify-between gap-3">
              <span className="font-mono text-[13px] tracking-[0.06em] text-neutral-300">Unlimited Q1clicks +</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Recommended
              </span>
            </header>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-normal text-[56px] leading-none tracking-[-0.02em] tabular-nums text-primary-foreground">$12</span>
                <span className="text-[14px] text-neutral-400">/ month</span>
              </div>
              <p className="text-[14px] m-0 text-neutral-400">Infinite autofills plus the full AI toolkit.</p>
            </div>
            <div className="h-px bg-neutral-800"></div>
            <ul className="flex flex-col gap-2.5 flex-1">
              <li className="text-[13.5px] text-neutral-300 leading-snug">Everything in Free</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">AI resume tailoring & unlimited resumes</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">AI response writer</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">Infinite AI autofills</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">AI Agent (LinkedIn Easy Apply)</li>
              <li className="text-[13.5px] text-neutral-300 leading-snug">Gmail inbox tracking</li>
            </ul>
            <a
              className="inline-flex items-center justify-center font-display font-medium tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-[.25s] ease-[cubic-bezier(.2,.8,.2,1)] whitespace-nowrap no-underline bg-transparent text-primary-foreground border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 px-5 py-3 text-[14.5px] gap-2.5 w-full"
              href="#start"
            >
              Go unlimited
            </a>
          </article>
        </div>

        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          {/* Weekly */}
          <article className="relative rounded-[16px] border p-6 flex flex-col gap-2 border-border bg-card">
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">Weekly</span>
            <div className="flex items-end gap-1.5">
              <span className="font-display font-normal text-[28px] leading-none tracking-[-0.02em] tabular-nums text-foreground">$0.71</span>
              <span className="text-[13px] text-muted-foreground pb-0.5">/ day</span>
            </div>
            <span className="text-[12px] text-muted-foreground">$5 total /week</span>
          </article>

          {/* Monthly (Featured) */}
          <article className="relative rounded-[16px] border p-6 flex flex-col gap-2 border-2 border-emerald-600 bg-emerald-50/50">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-primary-foreground font-mono text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full whitespace-nowrap bg-emerald-700">
              Save 44%
            </span>
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">Monthly</span>
            <div className="flex items-end gap-1.5">
              <span className="font-display font-normal text-[28px] leading-none tracking-[-0.02em] tabular-nums text-foreground">$0.40</span>
              <span className="text-[13px] text-muted-foreground pb-0.5">/ day</span>
            </div>
            <span className="text-[12px] text-muted-foreground">$12 total /month</span>
          </article>

          {/* 3 Months */}
          <article className="relative rounded-[16px] border p-6 flex flex-col gap-2 border-border bg-card">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-primary-foreground font-mono text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full whitespace-nowrap bg-emerald-600">
              Save 55%
            </span>
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted-foreground uppercase">3 Months</span>
            <div className="flex items-end gap-1.5">
              <span className="font-display font-normal text-[28px] leading-none tracking-[-0.02em] tabular-nums text-foreground">$0.32</span>
              <span className="text-[13px] text-muted-foreground pb-0.5">/ day</span>
            </div>
            <span className="text-[12px] text-muted-foreground">$29 total /3 months</span>
          </article>
        </div>

        <div className="mt-6 grid grid-cols-3 max-md:grid-cols-1 border border-border rounded-[16px] bg-card overflow-hidden">
          <div className="px-6 py-5 flex flex-col gap-1 border-r border-border last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
            <span className="text-[14px] font-medium text-foreground">Free to start</span>
            <span className="text-[13px] text-muted-foreground">A lifetime autofill allowance – no card required.</span>
          </div>
          <div className="px-6 py-5 flex flex-col gap-1 border-r border-border last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
            <span className="text-[14px] font-medium text-foreground">Cancel any time</span>
            <span className="text-[13px] text-muted-foreground">Stop billing in one click.</span>
          </div>
          <div className="px-6 py-5 flex flex-col gap-1 border-r border-border last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
            <span className="text-[14px] font-medium text-foreground">Glass-box always</span>
            <span className="text-[13px] text-muted-foreground">Every plan: the extension fills, you submit.</span>
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
      question: "Does Q1clicks ever submit for me?",
      answer: "No. The extension only fills the form in your browser. You review every field and click the site's own Submit – or edit it, or refuse it."
    },
    {
      question: "Will my LinkedIn or Indeed accounts get banned?",
      answer: "Absolutely not. Because Q1clicks operates as a local browser extension and does not perform automated background submissions, it is indistinguishable from manual typing to ATS platforms."
    },
    {
      question: "Can I change what it writes?",
      answer: "Yes, completely. You can edit any filled field directly on the page before submitting, or customize your profile templates to change the default answers."
    },
    {
      question: "How does outcome tracking work?",
      answer: "By connecting your Gmail account with read-only permissions, our system securely parses incoming recruiter emails to automatically update application statuses in your dashboard."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. Your personal data and resume details are encrypted both in transit and at rest. We never sell your data to third parties."
    },
    {
      question: "What does it cost?",
      answer: "We offer a robust Free tier that includes standard autofilling. For power users, our Unlimited plan starts at just $12/month."
    }
  ];

  return (
    <section id="faq" className="bg-background text-foreground py-16 md:py-20 transition-colors duration-300">
      <div className="max-w-[1180px] mx-auto px-8">
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
    <section id="start" className="relative overflow-hidden bg-primary text-primary-foreground py-20 md:py-28">
      <span className="absolute -top-[260px] -right-[160px] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.35),transparent_64%)] blur-[24px] pointer-events-none"></span>

      <div className="relative z-10 max-w-[1152px] mx-auto px-12 max-md:px-6 flex flex-col items-start gap-8">
        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <span className="inline-flex items-center gap-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase text-primary-foreground/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-none"></span>
            Free to start. Upgrade only if it sticks.
          </span>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <h2 className="font-sans font-semibold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight m-0 max-w-[20ch] text-balance">
            Fill the next form in one click –<span className="font-serif italic font-medium text-teal-300">you stay on the wheel.</span>
          </h2>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <div className="flex gap-2.5 flex-wrap">
            <a
              className="inline-flex items-center justify-center font-sans font-medium tracking-tight rounded-lg cursor-pointer transition-all duration-200 ease-out whitespace-nowrap no-underline bg-emerald-600 text-primary-foreground hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg px-6 py-3.5 text-[15px] gap-2.5"
              href="https://chromewebstore.google.com/detail/otclickus-autofill/iiadhkoapkhkjiohapmlhfmglnklcajl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start applying – free
              <Icon icon="lucide:arrow-right" className="text-base" />
            </a>
          </div>
        </div>

        <div className="transition-[opacity,transform] duration-[0.8s] ease-out opacity-100 translate-y-0">
          <p className="font-mono text-[11.5px] tracking-wider text-primary-foreground/50 m-0">
            No card required · the extension fills, you click the site's own Submit
          </p>
        </div>
      </div>
    </section>
  );
};



// --- MAIN PAGE COMPONENT ---

const OtclickGlassBoxAutofillForJobApplications: React.FC = () => {
  const [activePipelineStage, setActivePipelineStage] = useState<number>(1);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const playDemoVideo = () => {
    setIsVideoPlaying(true);
  };

  const selectPipelineStage = (stageId: number) => {
    setActivePipelineStage(stageId);
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