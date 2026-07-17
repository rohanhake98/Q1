# Q1 Careers — Detailed Technical Architecture & Development Plan

Version: 2.0 (Expanded)
Project Type: Production-Ready Job Portal
Framework: React + Vite + TypeScript
Backend: Supabase (PostgreSQL + Auth + Storage)
Goal: A scalable, SEO-friendly job portal that handles 100,000+ jobs using **one reusable dynamic page**, not thousands of hand-built pages.

This is an elaboration of your original v1.0 plan — same stack, same flow, same route structure. Every section below adds the "how," with schema, code, and config so it's implementable, not just conceptual.

---

## 1. Project Goals (unchanged, made concrete)

| Goal | How it's achieved |
|---|---|
| Daily job uploads | Admin dashboard form → insert into `jobs` table |
| No manual pages per job | One route `/jobs/:slug` reads from DB at request time |
| SEO-friendly | Dynamic `<head>` tags + sitemap + JSON-LD per job |
| Fast loading | Route-based code splitting, pagination, image CDN via Supabase Storage |
| Scalable to 100k+ jobs | DB does the filtering/pagination — frontend never loads the full table |

Core rule to enforce in code review: **no new `.tsx` page file may be created to represent an individual job, company, or blog post.** If a PR adds one, it's wrong.

---

## 2. High-Level Architecture (same diagram, annotated)

```
                    User
                      │
                      ▼
            React + Vite Frontend (SPA, SSR optional via Vercel)
                      │
                      ▼
             React Router Dynamic Routes  (":slug" params)
                      │
                      ▼
                 Supabase Client (supabase-js)
                      │
      ┌───────────────┴───────────────┐
      ▼                               ▼
 PostgreSQL (via PostgREST)     Supabase Storage (S3-compatible)
      │                               │
      ▼                               ▼
 jobs / blogs / companies       logos, banners, thumbnails, PDFs
 (with RLS policies)            (public read, admin write)
```

Key point worth calling out: Supabase's PostgREST layer means your frontend talks to the DB almost directly — `services/jobs.ts` wraps `supabase.from('jobs').select()`, there's no custom Express/Node API layer to maintain. This keeps the architecture in section 2 accurate to what you actually run.

---

## 3. Technology Stack (same, with package names)

**Frontend**
```json
{
  "react": "^18",
  "vite": "^5",
  "typescript": "^5",
  "tailwindcss": "^3",
  "react-router-dom": "^6",
  "framer-motion": "^11",
  "lucide-react": "latest",
  "react-hook-form": "^7",
  "zod": "^3",
  "@tanstack/react-query": "^5",
  "react-helmet-async": "^2"
}
```
- **@tanstack/react-query** — added for caching/dedup of Supabase reads (pagination, search, job details). Not in your v1 list but implied by "Caching" + "Memoization" in section 16 — this is the standard way to do that with Supabase.
- **react-helmet-async** — implements section 17's dynamic meta tags. SPA `<head>` mutation needs this (or Vercel's SSR/prerendering — see note in section 17).

**Backend / Auth / Storage** — unchanged: Supabase, PostgreSQL, RLS, Supabase Auth, Supabase Storage.

**Deployment** — Vercel. **Analytics** — GA4 + Microsoft Clarity. **SEO** — dynamic meta, sitemap, robots.txt, JSON-LD.

---

## 4. Folder Structure (same tree, roles annotated)

```
src/
  assets/
  components/
    navbar/
    footer/
    job/            → JobCard, JobFilterBar, JobBadge, ApplyButton
    cards/           → CompanyCard, BlogCard, ResourceCard
    forms/           → JobForm (admin), SearchForm
    search/          → SearchBar, FilterPanel, SortDropdown
    ui/              → shadcn-style primitives: Button, Input, Select, Skeleton
  pages/
    Home/
    Jobs/            → list view, uses pagination + filters
    JobDetails/       → THE single dynamic job page (JobDetails.tsx)
    Companies/
    CompanyDetails/
    Blogs/
    BlogDetails/
    Resources/
    ResourceDetails/
    About/
    Contact/
    Admin/            → protected, behind Supabase Auth
  layouts/            → MainLayout (navbar+footer), AdminLayout (sidebar)
  hooks/              → useJobs, useJob, useCompanies, useDebounce, usePagination
  services/
    supabase.ts       → client init
    jobs.ts           → all job queries
    blogs.ts
    companies.ts
    seo.ts            → builds meta tag objects
  types/              → Job, Company, Blog, Resource interfaces (generated from DB)
  context/            → AuthContext
  utils/              → slugify.ts, formatSalary.ts, formatDate.ts
  constants/          → filter options, employment types, work modes
  routes/             → route config array (path + element + protected flag)
```

---

## 5. Route Structure (unchanged) — with the router config

```tsx
// routes/index.tsx
const routes = [
  { path: '/', element: <Home /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/jobs/:slug', element: <JobDetails /> },
  { path: '/company/:slug', element: <CompanyDetails /> },
  { path: '/blog/:slug', element: <BlogDetails /> },
  { path: '/resources/:slug', element: <ResourceDetails /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/admin', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: '/admin/jobs', element: <ProtectedRoute><ManageJobs /></ProtectedRoute> },
  { path: '/admin/blogs', element: <ProtectedRoute><ManageBlogs /></ProtectedRoute> },
  { path: '/admin/resources', element: <ProtectedRoute><ManageResources /></ProtectedRoute> },
];
```

Every `:slug` route is the enforcement point for "no page-per-job" — there is exactly one component per content type, ever.

---

## 6. Job Flow (elaborated with actual steps)

1. Admin fills `JobForm` in `/admin/jobs` → Zod validates → on submit:
2. `slugify(title + '-' + company_name)` generates `job_slug` (client-side preview, server-side regenerated/checked for uniqueness on insert via a Postgres trigger or unique constraint).
3. Row inserted into `jobs` table, `status = 'draft'` by default.
4. Admin clicks **Publish** → `status = 'published'`.
5. `/jobs/google-software-engineer` is now live — `JobDetails.tsx` queries `jobs` where `job_slug = :slug AND status = 'published'`.
6. Sitemap regeneration (section 18) picks it up on next build/cron run → Google indexes it.
7. It appears in `/jobs` listing and on `/company/google` because both query the same table filtered by `company_slug` / `status`.

No manual page creation at any step — only a DB write.

---

## 7. Database Design (expanded into real SQL)

```sql
create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company_name text not null,
  company_slug text not null references companies(slug),
  job_slug text unique not null,
  experience text,                 -- e.g. "0-1 Year"
  location text,
  salary text,
  employment_type text check (employment_type in ('full-time','part-time','internship','contract')),
  work_mode text check (work_mode in ('remote','onsite','hybrid')),
  description text,
  responsibilities text[],
  requirements text[],
  preferred_skills text[],
  benefits text[],
  education text,
  apply_url text,
  company_logo text,               -- Supabase Storage public URL
  banner_image text,
  status text default 'draft' check (status in ('draft','published','archived')),
  featured boolean default false,
  deadline date,
  tags text[],
  seo_title text,
  seo_description text,
  canonical_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_jobs_slug on jobs(job_slug);
create index idx_jobs_company on jobs(company_slug);
create index idx_jobs_status_created on jobs(status, created_at desc);
create index idx_jobs_tags on jobs using gin(tags);
```

`companies`, `blogs`, `resources` follow the same pattern (own `slug`, `status`, `seo_*` columns) — kept out here for brevity but structurally identical.

**RLS policy example** (public reads only published rows, admin reads/writes everything):
```sql
alter table jobs enable row level security;

create policy "public read published jobs"
on jobs for select
using (status = 'published');

create policy "admin full access"
on jobs for all
using (auth.jwt() ->> 'role' = 'admin');
```

---

## 8. Dynamic Page Rendering (the core mechanic, in code)

```tsx
// pages/JobDetails/JobDetails.tsx
export default function JobDetails() {
  const { slug } = useParams();
  const { data: job, isLoading } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug!),
  });

  if (isLoading) return <JobDetailsSkeleton />;
  if (!job) return <NotFound />;

  return (
    <>
      <SeoHead
        title={job.seo_title ?? `${job.title} at ${job.company_name} | Q1 Careers`}
        description={job.seo_description ?? job.description.slice(0, 155)}
        canonical={job.canonical_url ?? `https://q1careers.com/jobs/${job.job_slug}`}
        jsonLd={buildJobPostingSchema(job)}
      />
      <JobHeader job={job} />
      <JobBody job={job} />
      <ApplyButton url={job.apply_url} />
    </>
  );
}
```

```ts
// services/jobs.ts
export async function getJobBySlug(slug: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('job_slug', slug)
    .eq('status', 'published')
    .single();
  if (error) return null;
  return data;
}
```

This one file is the entirety of "job page" logic, at any job count.

---

## 9. Admin Dashboard (elaborated feature-by-feature)

- **Login** — Supabase Auth (email/password or magic link), role stored in `user_metadata.role = 'admin'`.
- **Create/Edit Job** — `JobForm` (React Hook Form + Zod schema matching the `jobs` table).
- **Automatic Slug Generator** — `slugify(title, company)`, editable before save, uniqueness checked with a `select` before insert.
- **Draft / Publish / Archive** — just the `status` enum column; toggled from a dropdown in the job list.
- **Live Preview** — renders `JobDetails` component in a modal using the unsaved form state (same component reused, not a copy).
- **Bulk Upload / CSV Import** — parse CSV client-side (papaparse), map columns to `jobs` schema, batch insert via `supabase.from('jobs').insert([...rows])`.
- **Upload Logo/Banner** — `supabase.storage.from('job-assets').upload(path, file)`, store the returned public URL in `company_logo` / `banner_image`.

---

## 10. Company System (unchanged design, query shape)

```ts
export async function getCompanyWithJobs(slug: string) {
  const company = await supabase.from('companies').select('*').eq('slug', slug).single();
  const jobs = await supabase.from('jobs')
    .select('*')
    .eq('company_slug', slug)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return { company: company.data, jobs: jobs.data };
}
```
`/company/google` is one component (`CompanyDetails.tsx`) reused for every company, exactly like `JobDetails`.

---

## 11. Blog System / 12. Resources

Same pattern as jobs: one table, one slug column, one dynamic page (`BlogDetails.tsx`, `ResourceDetails.tsx`), one status column gating public visibility. Resources additionally store a `pdf_url` (Supabase Storage) alongside `thumbnail_url`.

---

## 13. Search (query-level filtering, not frontend filtering)

```ts
export async function searchJobs(filters: JobFilters, page: number) {
  let query = supabase.from('jobs').select('*', { count: 'exact' }).eq('status', 'published');

  if (filters.company) query = query.eq('company_slug', filters.company);
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters.workMode) query = query.eq('work_mode', filters.workMode);
  if (filters.skills?.length) query = query.contains('tags', filters.skills);

  const from = page * 20;
  return query.order('created_at', { ascending: false }).range(from, from + 19);
}
```
This directly implements section 13's rule: filtering happens in the SQL query, never by loading all jobs into the browser and `.filter()`-ing in JS.

---

## 14. Pagination (range-based, matches Postgres `range()`)

- Page size: 20 (configurable constant).
- `range(from, to)` maps directly to SQL `LIMIT/OFFSET`.
- Infinite scroll: use `useInfiniteQuery` from React Query, `getNextPageParam` = next `from` value, stop when `count` returned by the query is exhausted.

---

## 15. Image Storage (bucket layout)

```
supabase storage buckets:
  job-assets/       (banners, company logos)
  blog-assets/
  resource-assets/  (thumbnails + PDFs)
```
Public read policy on buckets; only authenticated admin role can `insert`/`update`/`delete`. DB stores the public URL string only — never binary data.

---

## 16. Performance Strategy (mapped to concrete techniques)

| Original item | Implementation |
|---|---|
| Lazy Loading | `React.lazy()` per route in `routes/index.tsx` |
| Route Splitting | Vite handles this automatically per dynamic `import()` |
| Image Optimization | Supabase Storage image transforms (`?width=400&quality=75`) or Vercel Image Optimization |
| Caching | React Query `staleTime`/`cacheTime` per query key |
| Memoization | `useMemo`/`React.memo` on `JobCard` lists |
| Pagination | `range()` queries, section 14 |
| Virtual Lists | `@tanstack/react-virtual` if a list ever exceeds ~200 rendered rows |
| Code Splitting | Per-route via `React.lazy` |

---

## 17. SEO Strategy (with the SPA caveat made explicit)

```tsx
// components/SeoHead.tsx
export function SeoHead({ title, description, canonical, jsonLd }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
```

**Important caveat worth flagging on your v1 plan:** `react-helmet-async` updates `<head>` client-side, which works for social share cards handled by Vercel's OG image support but **Googlebot does render JS, so this is fine for Google specifically** — the risk is other crawlers/scrapers that don't execute JS. If that matters for you, the fallback is Vercel's SSR/prerendering (`vercel.json` rewrites to a prerender function) for the `/jobs/:slug`, `/company/:slug`, `/blog/:slug` routes only. Worth deciding now rather than after 10k jobs are live.

**JSON-LD** — use schema.org's `JobPosting` type per job (title, hiringOrganization, jobLocation, employmentType, validThrough from `deadline`). This is what makes jobs eligible for Google's "Jobs" rich result carousel.

---

## 18. Sitemap (generation approach)

Options, in order of fit for your stack:
1. **Vercel cron + serverless function**: nightly job queries all published `jobs`/`companies`/`blogs`/`resources`, writes `sitemap.xml` to a public path or serves it from an API route (`/api/sitemap.xml`).
2. **Build-time generation**: a Node script run in the Vercel build step queries Supabase and writes `public/sitemap.xml` before `vite build`.

At 100k+ URLs, split into `sitemap-jobs.xml`, `sitemap-companies.xml`, etc., referenced from a `sitemap-index.xml` (single sitemap files should stay under ~50k URLs per Google's limit).

---

## 19. robots.txt (unchanged)

```
User-agent: *
Allow: /
Allow: /jobs
Allow: /company
Allow: /blog
Allow: /resources
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

Sitemap: https://q1careers.com/sitemap-index.xml
```

---

## 20. Future Scaling (unchanged claim, why it holds)

Because every list view uses `range()`-based pagination and the DB does the filtering (sections 13–14), and every detail page is one component fed by a single indexed query (section 8), growing from 100 → 100,000 jobs changes nothing about the frontend code path — only query volume and index size. The indexes defined in section 7 (`job_slug`, `company_slug`, `status+created_at`, GIN on `tags`) are what keep query time flat as rows grow.

---

## 21. Recommended Features (Phase 2) — unchanged list, grouped

- **User-facing**: Bookmarks, Recently Viewed, Apply Tracker, Job Alerts, Email Notifications, Dark Mode
- **Content**: Resume Builder, Resume Checker/ATS Score, Company Reviews, Salary Insights
- **AI-powered** (natural fit for Supabase Edge Functions calling an LLM API): AI Resume Optimizer, AI Cover Letter Generator, AI Interview Prep, AI Career Roadmap, AI Skill Gap Analysis

---

## 22. Security (unchanged, with RLS example already shown in section 7)

- Supabase Auth for admin login, JWT role claim gates `/admin/*` routes client-side (`ProtectedRoute`) **and** server-side via RLS (client-side alone is not sufficient — RLS is the real boundary).
- Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — anon key is safe to expose in frontend by design; RLS is what protects data, not key secrecy.
- Zod validation on every form before it reaches Supabase.
- Rate limiting on public search endpoints if abuse becomes a concern (Supabase Edge Function + simple IP-based counter, or Vercel's built-in rate limiting).

---

## 23. Deployment (unchanged)

Frontend → Vercel · DB/Storage/Auth → Supabase · Analytics → GA4 + Clarity · Errors → Sentry (wrap `App` in Sentry's ErrorBoundary, set up source maps in the Vite build).

---

## 24. Final Goal (unchanged — this plan is the "how")

Admin uploads job data → the system automatically creates the page, generates the URL, generates SEO metadata, updates the sitemap, makes the page searchable, displays it in listings, links it to the company profile, and stays fast. No new React page is ever created for an individual job, company, blog post, or resource — that constraint is what every section above is built to preserve.