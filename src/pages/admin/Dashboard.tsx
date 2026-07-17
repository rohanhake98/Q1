import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import FileUploader from '../../components/FileUploader';

interface Company {
  id: string;
  name: string;
  slug: string;
  website_url?: string;
  hq_location?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'job' | 'company' | 'blog' | 'resource'>('job');
  
  // Listings lists
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // Status notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Preview Modals
  const [previewJob, setPreviewJob] = useState<any | null>(null);
  const [previewBlog, setPreviewBlog] = useState<any | null>(null);
  const [previewResource, setPreviewResource] = useState<any | null>(null);

  // --- FORM STATES ---
  
  const [companyForm, setCompanyForm] = useState({
    name: '',
    slug: '',
    description: '',
    website_url: '',
    hq_location: '',
    industry: '',
    company_size: '',
    founded_year: '',
    logo_url: ''
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    company_name: '',
    company_slug: '',
    job_slug: '',
    experience: '',
    location: '',
    salary: '',
    employment_type: 'internship',
    work_mode: 'remote',
    description: '',
    apply_url: '',
    tags: '',
    status: 'published',
    featured: false,
    company_logo: '',
    banner_image: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    content: '',
    summary: '',
    author_name: '',
    featured_image: '',
    tags: '',
    status: 'published'
  });

  const [resourceForm, setResourceForm] = useState({
    title: '',
    slug: '',
    description: '',
    pdf_url: '',
    thumbnail_url: '',
    category: 'Guide',
    status: 'published',
    tags: ''
  });

  // Load all tables for management view
  const loadAllListings = async () => {
    setLoadingListings(true);
    try {
      // 1. Fetch companies
      const compRes = await supabase.from('companies').select('*').order('name');
      if (compRes.data) setCompanies(compRes.data);

      // 2. Fetch jobs
      const jobsRes = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (jobsRes.data) setJobs(jobsRes.data);

      // 3. Fetch blogs
      const blogsRes = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (blogsRes.data) setBlogs(blogsRes.data);

      // 4. Fetch resources
      const resRes = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (resRes.data) setResources(resRes.data);

      // Auto-select first company in job form if empty
      if (compRes.data && compRes.data.length > 0 && !jobForm.company_slug) {
        setJobForm(prev => ({ ...prev, company_slug: compRes.data[0].slug }));
      }
    } catch (err) {
      console.error('Error fetching dashboard lists:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    loadAllListings();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // --- CRUD ACTIONS ---

  const handleDelete = async (table: string, id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setSuccessMsg(`Deleted "${name}" successfully.`);
      loadAllListings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete listing.');
    }
  };

  const handleToggleStatus = async (table: string, id: string, currentStatus: string, name: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase.from(table).update({ status: nextStatus }).eq('id', id);
      if (error) throw error;
      setSuccessMsg(`Updated status of "${name}" to "${nextStatus}".`);
      loadAllListings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status.');
    }
  };

  // --- SUBMIT CREATION HANDLERS ---

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const slug = companyForm.slug || generateSlug(companyForm.name);

    try {
      const { error } = await supabase.from('companies').insert([{
        name: companyForm.name,
        slug,
        description: companyForm.description || null,
        website_url: companyForm.website_url || null,
        hq_location: companyForm.hq_location || null,
        industry: companyForm.industry || null,
        company_size: companyForm.company_size || null,
        founded_year: companyForm.founded_year ? parseInt(companyForm.founded_year) : null,
        logo_url: companyForm.logo_url || null
      }]);

      if (error) throw error;

      setSuccessMsg(`Company "${companyForm.name}" created successfully!`);
      setCompanyForm({
        name: '',
        slug: '',
        description: '',
        website_url: '',
        hq_location: '',
        industry: '',
        company_size: '',
        founded_year: '',
        logo_url: ''
      });
      loadAllListings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inserting company.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const companySlug = jobForm.company_slug || generateSlug(jobForm.company_name);
    const jobSlug = jobForm.job_slug || `${generateSlug(jobForm.title)}-${companySlug}`;
    const tagsArray = jobForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const { error } = await supabase.from('jobs').insert([{
        title: jobForm.title,
        company_name: jobForm.company_name,
        company_slug: companySlug,
        job_slug: jobSlug,
        experience: jobForm.experience || null,
        location: jobForm.location || 'Remote',
        salary: jobForm.salary || null,
        employment_type: jobForm.employment_type,
        work_mode: jobForm.work_mode,
        description: jobForm.description,
        apply_url: jobForm.apply_url,
        tags: tagsArray,
        status: jobForm.status,
        featured: jobForm.featured,
        company_logo: jobForm.company_logo || null,
        banner_image: jobForm.banner_image || null
      }]);

      if (error) throw error;

      setSuccessMsg(`Job listing "${jobForm.title}" published successfully!`);
      setJobForm(prev => ({
        ...prev,
        title: '',
        company_name: '',
        company_slug: '',
        job_slug: '',
        description: '',
        apply_url: '',
        tags: '',
        featured: false,
        company_logo: '',
        banner_image: ''
      }));
      loadAllListings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inserting job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const slug = blogForm.slug || generateSlug(blogForm.title);
    const tagsArray = blogForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const { error } = await supabase.from('blogs').insert([{
        title: blogForm.title,
        slug,
        content: blogForm.content,
        summary: blogForm.summary || null,
        author_name: blogForm.author_name || null,
        featured_image: blogForm.featured_image || null,
        tags: tagsArray,
        status: blogForm.status
      }]);

      if (error) throw error;

      setSuccessMsg(`Blog post "${blogForm.title}" created successfully!`);
      setBlogForm({
        title: '',
        slug: '',
        content: '',
        summary: '',
        author_name: '',
        featured_image: '',
        tags: '',
        status: 'published'
      });
      loadAllListings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inserting blog.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const slug = resourceForm.slug || generateSlug(resourceForm.title);
    const tagsArray = resourceForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const { error } = await supabase.from('resources').insert([{
        title: resourceForm.title,
        slug,
        description: resourceForm.description || null,
        pdf_url: resourceForm.pdf_url,
        thumbnail_url: resourceForm.thumbnail_url || null,
        category: resourceForm.category,
        status: resourceForm.status,
        tags: tagsArray
      }]);

      if (error) throw error;

      setSuccessMsg(`Resource file "${resourceForm.title}" published successfully!`);
      setResourceForm({
        title: '',
        slug: '',
        description: '',
        pdf_url: '',
        thumbnail_url: '',
        category: 'Guide',
        status: 'published',
        tags: ''
      });
      loadAllListings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inserting resource.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-card border-r border-border/40 p-6 flex flex-col justify-between flex-none">
        <div>
          <div className="flex items-center gap-[11px] font-semibold text-[17px] tracking-[-0.02em] text-foreground mb-8">
            <img
              alt="Q1clicks logo"
              width="30"
              height="30"
              className="rounded-lg flex-none select-none"
              src="/qlogo.jpg"
            />
            Q1clicks Admin
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('job'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'job' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon="lucide:briefcase" className="text-base" />
              Job Listings
            </button>

            <button
              onClick={() => { setActiveTab('company'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'company' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon="lucide:building-2" className="text-base" />
              Companies
            </button>

            <button
              onClick={() => { setActiveTab('blog'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'blog' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon="lucide:book-open" className="text-base" />
              Blog Articles
            </button>

            <button
              onClick={() => { setActiveTab('resource'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'resource' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon="lucide:download" className="text-base" />
              Downloadables
            </button>
          </nav>
        </div>

        {/* User logout controls */}
        <div className="border-t border-border/40 mt-8 pt-6">
          <div className="text-xs text-muted-foreground mb-3 truncate">
            Logged in as: <br /><strong>{user?.email}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-muted border border-border/50 text-foreground py-2 rounded-lg text-xs font-semibold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:log-out" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-4xl space-y-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight m-0 capitalize">
            Manage {activeTab}s
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Add new listings using the form below, or inspect and manage existing database entries.
          </p>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="bg-primary/10 border border-primary/20 text-primary rounded-xl p-4 text-sm flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
            <Icon icon="lucide:check-circle" className="text-lg flex-none mt-0.5 animate-bounce" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
            <Icon icon="lucide:alert-circle" className="text-lg flex-none mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* --- ADD NEW FORM VIEWS --- */}

        {/* 1. Job Form */}
        {activeTab === 'job' && (
          <div className="space-y-8">
            <form onSubmit={handleAddJob} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Icon icon="lucide:plus" className="text-primary" />
                Add New Job Listing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, OpenAI, Google"
                    value={jobForm.company_name}
                    onChange={(e) => setJobForm(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Company Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. stripe"
                    value={jobForm.company_slug}
                    onChange={(e) => setJobForm(prev => ({ ...prev, company_slug: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Software Engineer"
                    value={jobForm.title}
                    onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Job Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. lead-software-engineer"
                    value={jobForm.job_slug}
                    onChange={(e) => setJobForm(prev => ({ ...prev, job_slug: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              {/* Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border/20 rounded-xl p-4 bg-background/50">
                <FileUploader
                  bucketName="job-assets"
                  label="Company Logo Override"
                  onUploadComplete={(url) => setJobForm(prev => ({ ...prev, company_logo: url }))}
                  accept="image/*"
                />
                <FileUploader
                  bucketName="job-assets"
                  label="Job Banner Image"
                  onUploadComplete={(url) => setJobForm(prev => ({ ...prev, banner_image: url }))}
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={jobForm.employment_type}
                    onChange={(e) => setJobForm(prev => ({ ...prev, employment_type: e.target.value }))}
                    className="w-full bg-background border border-border/80 outline-none rounded-lg py-2 px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Work Mode
                  </label>
                  <select
                    value={jobForm.work_mode}
                    onChange={(e) => setJobForm(prev => ({ ...prev, work_mode: e.target.value }))}
                    className="w-full bg-background border border-border/80 outline-none rounded-lg py-2 px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Salary / Hourly Rate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $120,000 - $140,000"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={jobForm.location}
                    onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Required Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2+ years React exp"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Apply URL * (External ATS link)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://jobs.lever.co/company/job-id"
                  value={jobForm.apply_url}
                  onChange={(e) => setJobForm(prev => ({ ...prev, apply_url: e.target.value }))}
                  className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Tags (Comma-separated skills)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Node.js"
                  value={jobForm.tags}
                  onChange={(e) => setJobForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Job Description *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Describe the role requirements, expectations, and tech stack details..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2.5 px-3 text-sm text-foreground resize-y"
                />
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-border/30">
                <label className="flex items-center gap-2 text-sm text-foreground font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobForm.featured}
                    onChange={(e) => setJobForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-border text-primary focus:ring-primary cursor-pointer w-4 h-4"
                  />
                  Mark listing as Featured
                </label>
                <div>
                  <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-mono mr-2">Status</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm(prev => ({ ...prev, status: e.target.value }))}
                    className="bg-background border border-border/80 outline-none rounded py-1 px-2.5 text-xs text-foreground focus:border-primary"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {submitting ? <Icon icon="line-md:loading-twotone-loop" /> : 'Create and Publish Job Listing'}
              </button>
            </form>

            {/* List Existing Jobs */}
            <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Existing Job Listings ({jobs.length})</h3>
              {loadingListings ? (
                <div className="text-sm text-muted-foreground py-4">Fetching active listings...</div>
              ) : jobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 font-mono text-xs text-muted-foreground uppercase">
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Company</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(j => (
                        <tr key={j.id} className="border-b border-border/20 hover:bg-muted/30 transition">
                          <td className="py-3 font-medium text-foreground">{j.title}</td>
                          <td className="py-3 text-muted-foreground">{j.company_name}</td>
                          <td className="py-3">
                            <button
                              onClick={() => handleToggleStatus('jobs', j.id, j.status, j.title)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border uppercase cursor-pointer transition ${
                                j.status === 'published'
                                  ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                              }`}
                            >
                              {j.status}
                            </button>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => setPreviewJob(j)}
                              className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDelete('jobs', j.id, j.title)}
                              className="text-xs text-red-500 hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-4">No job listings found in database.</div>
              )}
            </div>
          </div>
        )}

        {/* 2. Company Form */}
        {activeTab === 'company' && (
          <div className="space-y-8">
            <form onSubmit={handleAddCompany} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Icon icon="lucide:plus" className="text-primary" />
                Add New Company Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linear"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Company Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. linear"
                    value={companyForm.slug}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              {/* Upload logo */}
              <div className="border border-border/20 rounded-xl p-4 bg-background/50">
                <FileUploader
                  bucketName="job-assets"
                  label="Company Logo Image"
                  onUploadComplete={(url) => setCompanyForm(prev => ({ ...prev, logo_url: url }))}
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linear.app"
                    value={companyForm.website_url}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, website_url: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    HQ Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={companyForm.hq_location}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, hq_location: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software & SaaS"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Company Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 - 150 employees"
                    value={companyForm.company_size}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, company_size: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2019"
                    value={companyForm.founded_year}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, founded_year: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  About Company
                </label>
                <textarea
                  rows={4}
                  placeholder="Brief description about the company culture, funding, and products..."
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2.5 px-3 text-sm text-foreground resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {submitting ? <Icon icon="line-md:loading-twotone-loop" /> : 'Create Company Profile'}
              </button>
            </form>

            {/* List Existing Companies */}
            <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Existing Companies ({companies.length})</h3>
              {loadingListings ? (
                <div className="text-sm text-muted-foreground py-4">Fetching active listings...</div>
              ) : companies.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 font-mono text-xs text-muted-foreground uppercase">
                        <th className="py-2.5">Name</th>
                        <th className="py-2.5">HQ Location</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map(c => (
                        <tr key={c.id} className="border-b border-border/20 hover:bg-muted/30 transition">
                          <td className="py-3 font-medium text-foreground">{c.name}</td>
                          <td className="py-3 text-muted-foreground">{c.hq_location || 'N/A'}</td>
                          <td className="py-3 text-right space-x-2">
                            {c.website_url && (
                              <a
                                href={c.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline no-underline"
                              >
                                Website
                              </a>
                            )}
                            <button
                              onClick={() => handleDelete('companies', c.id, c.name)}
                              className="text-xs text-red-500 hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-4">No companies found in database.</div>
              )}
            </div>
          </div>
        )}

        {/* 3. Blog Form */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <form onSubmit={handleAddBlog} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Icon icon="lucide:plus" className="text-primary" />
                Add New Blog Article
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How to structure dynamic layouts"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Article Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. how-to-structure-dynamic-layouts"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              {/* Upload cover */}
              <div className="border border-border/20 rounded-xl p-4 bg-background/50">
                <FileUploader
                  bucketName="blog-assets"
                  label="Featured Cover Image"
                  onUploadComplete={(url) => setBlogForm(prev => ({ ...prev, featured_image: url }))}
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={blogForm.author_name}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, author_name: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Careers, Interviews, Tech"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Summary / Meta Description
                </label>
                <input
                  type="text"
                  placeholder="A brief subtitle or short description..."
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Content Body *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write the full post contents here..."
                  value={blogForm.content}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2.5 px-3 text-sm text-foreground resize-y"
                />
              </div>

              <div className="pt-3 border-t border-border/30">
                <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-mono mr-2">Status</label>
                <select
                  value={blogForm.status}
                  onChange={(e) => setBlogForm(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-background border border-border/80 outline-none rounded py-1 px-2.5 text-xs text-foreground focus:border-primary"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {submitting ? <Icon icon="line-md:loading-twotone-loop" /> : 'Create and Publish Post'}
              </button>
            </form>

            {/* List Existing Blogs */}
            <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Existing Articles ({blogs.length})</h3>
              {loadingListings ? (
                <div className="text-sm text-muted-foreground py-4">Fetching active listings...</div>
              ) : blogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 font-mono text-xs text-muted-foreground uppercase">
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Author</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(b => (
                        <tr key={b.id} className="border-b border-border/20 hover:bg-muted/30 transition">
                          <td className="py-3 font-medium text-foreground">{b.title}</td>
                          <td className="py-3 text-muted-foreground">{b.author_name || 'Anonymous'}</td>
                          <td className="py-3">
                            <button
                              onClick={() => handleToggleStatus('blogs', b.id, b.status, b.title)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border uppercase cursor-pointer transition ${
                                b.status === 'published'
                                  ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                              }`}
                            >
                              {b.status}
                            </button>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => setPreviewBlog(b)}
                              className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDelete('blogs', b.id, b.title)}
                              className="text-xs text-red-500 hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-4">No articles found in database.</div>
              )}
            </div>
          </div>
        )}

        {/* 4. Resource Form */}
        {activeTab === 'resource' && (
          <div className="space-y-8">
            <form onSubmit={handleAddResource} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Icon icon="lucide:plus" className="text-primary" />
                Add New Downloadable Resource
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CV Template PDF"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Resource Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. cv-template-pdf"
                    value={resourceForm.slug}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              {/* Upload files */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border/20 rounded-xl p-4 bg-background/50">
                <FileUploader
                  bucketName="resource-assets"
                  label="PDF File Document * (PDF only)"
                  onUploadComplete={(url) => setResourceForm(prev => ({ ...prev, pdf_url: url }))}
                  accept="application/pdf"
                />
                <FileUploader
                  bucketName="resource-assets"
                  label="Resource Thumbnail Image"
                  onUploadComplete={(url) => setResourceForm(prev => ({ ...prev, thumbnail_url: url }))}
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Category
                  </label>
                  <select
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-background border border-border/80 outline-none rounded-lg py-2 px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="Guide">Guide</option>
                    <option value="Template">Template</option>
                    <option value="Book">Ebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CV, Resume, Design"
                    value={resourceForm.tags}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2 px-3 text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the content of this file and how it helps applicants..."
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-lg py-2.5 px-3 text-sm text-foreground resize-y"
                />
              </div>

              <div className="pt-3 border-t border-border/30">
                <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground uppercase font-mono mr-2">Status</label>
                <select
                  value={resourceForm.status}
                  onChange={(e) => setResourceForm(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-background border border-border/80 outline-none rounded py-1 px-2.5 text-xs text-foreground focus:border-primary"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {submitting ? <Icon icon="line-md:loading-twotone-loop" /> : 'Create and Publish Downloadable'}
              </button>
            </form>

            {/* List Existing Resources */}
            <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Existing Resources ({resources.length})</h3>
              {loadingListings ? (
                <div className="text-sm text-muted-foreground py-4">Fetching active listings...</div>
              ) : resources.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 font-mono text-xs text-muted-foreground uppercase">
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map(r => (
                        <tr key={r.id} className="border-b border-border/20 hover:bg-muted/30 transition">
                          <td className="py-3 font-medium text-foreground">{r.title}</td>
                          <td className="py-3 text-muted-foreground">{r.category}</td>
                          <td className="py-3">
                            <button
                              onClick={() => handleToggleStatus('resources', r.id, r.status, r.title)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border uppercase cursor-pointer transition ${
                                r.status === 'published'
                                  ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                  : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                              }`}
                            >
                              {r.status}
                            </button>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => setPreviewResource(r)}
                              className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDelete('resources', r.id, r.title)}
                              className="text-xs text-red-500 hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-4">No resources found in database.</div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* --- LIVE PREVIEW MODALS --- */}

      {/* 1. Job Preview Modal */}
      {previewJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold uppercase">
                Live Draft Preview
              </span>
              <button 
                onClick={() => setPreviewJob(null)}
                className="w-7 h-7 rounded-full bg-muted border border-border/50 grid place-items-center hover:bg-muted/80 cursor-pointer"
              >
                <Icon icon="lucide:x" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold m-0">{previewJob.title}</h3>
                <p className="text-sm text-primary font-medium mt-1">{previewJob.company_name}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/40 p-4 rounded-xl text-xs">
                <div><strong>Location:</strong> <br/>{previewJob.location}</div>
                <div><strong>Type:</strong> <br/><span className="capitalize">{previewJob.employment_type}</span></div>
                <div><strong>Mode:</strong> <br/><span className="capitalize">{previewJob.work_mode}</span></div>
                <div><strong>Salary:</strong> <br/>{previewJob.salary || 'Not specified'}</div>
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase text-muted-foreground mb-1.5">Description</h4>
                <p className="text-sm text-muted-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {previewJob.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Blog Preview Modal */}
      {previewBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold uppercase">
                Live Draft Preview
              </span>
              <button 
                onClick={() => setPreviewBlog(null)}
                className="w-7 h-7 rounded-full bg-muted border border-border/50 grid place-items-center hover:bg-muted/80 cursor-pointer"
              >
                <Icon icon="lucide:x" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold m-0">{previewBlog.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5">By {previewBlog.author_name || 'Anonymous'}</p>
              </div>
              {previewBlog.featured_image && (
                <div className="rounded-xl overflow-hidden aspect-video max-h-56 bg-muted">
                  <img src={previewBlog.featured_image} alt="" className="object-cover w-full h-full" />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {previewBlog.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Resource Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold uppercase">
                Live Draft Preview
              </span>
              <button 
                onClick={() => setPreviewResource(null)}
                className="w-7 h-7 rounded-full bg-muted border border-border/50 grid place-items-center hover:bg-muted/80 cursor-pointer"
              >
                <Icon icon="lucide:x" />
              </button>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 h-32 rounded-lg bg-muted border border-border/30 flex-none overflow-hidden">
                {previewResource.thumbnail_url ? (
                  <img src={previewResource.thumbnail_url} alt="" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Icon icon="lucide:file-text" /></div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono bg-muted text-muted-foreground border px-2 py-0.5 rounded font-semibold uppercase">
                  {previewResource.category}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-1">{previewResource.title}</h3>
                <p className="text-xs text-muted-foreground">{previewResource.description}</p>
                <a 
                  href={previewResource.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-4 font-semibold"
                >
                  <Icon icon="lucide:external-link" />
                  View File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
