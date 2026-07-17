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
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'job' | 'company' | 'blog' | 'resource'>('job');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Status notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- FORM STATES ---
  
  // 1. Company Form State
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

  // 2. Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
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

  // 3. Blog Form State
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

  // 4. Resource Form State
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

  // Load companies for the Job selection dropdown
  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, slug')
        .order('name');
      if (error) throw error;
      setCompanies(data || []);
      
      // Auto select first company if available
      if (data && data.length > 0 && !jobForm.company_slug) {
        setJobForm(prev => ({ ...prev, company_slug: data[0].slug }));
      }
    } catch (err) {
      console.error('Error loading companies:', err);
    } finally {
      setLoadingCompanies(false);
    }
  };

  useEffect(() => {
    loadCompanies();
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

  // --- SUBMIT HANDLERS ---

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
      loadCompanies();
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

    if (!jobForm.company_slug) {
      setErrorMsg('You must select or create a company first before adding a job.');
      setSubmitting(false);
      return;
    }

    const selectedCompany = companies.find(c => c.slug === jobForm.company_slug);
    const jobSlug = jobForm.job_slug || `${generateSlug(jobForm.title)}-${generateSlug(selectedCompany?.name || '')}`;
    const tagsArray = jobForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const { error } = await supabase.from('jobs').insert([{
        title: jobForm.title,
        company_name: selectedCompany?.name || 'Unknown',
        company_slug: jobForm.company_slug,
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
        job_slug: '',
        description: '',
        apply_url: '',
        tags: '',
        featured: false,
        company_logo: '',
        banner_image: ''
      }));
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
              Add Job Listing
            </button>

            <button
              onClick={() => { setActiveTab('company'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'company' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon="lucide:building-2" className="text-base" />
              Add Company
            </button>

            <button
              onClick={() => { setActiveTab('blog'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'blog' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon="lucide:book-open" className="text-base" />
              Add Blog Article
            </button>

            <button
              onClick={() => { setActiveTab('resource'); setSuccessMsg(null); setErrorMsg(null); }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'resource' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon icon="lucide:download" className="text-base" />
              Add Downloadable
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
      <main className="flex-1 p-6 md:p-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight m-0 capitalize">
            Create New {activeTab}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Submit metadata directly into your Supabase database. Media files will upload to your public storage buckets.
          </p>
        </div>

        {/* Status messages */}
        {successMsg && (
          <div className="bg-primary/10 border border-primary/20 text-primary rounded-xl p-4 text-sm mb-6 flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
            <Icon icon="lucide:check-circle" className="text-lg flex-none mt-0.5 animate-bounce" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-sm mb-6 flex items-start gap-2.5 animate-[fadeIn_0.2s_ease-out]">
            <Icon icon="lucide:alert-circle" className="text-lg flex-none mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* --- FORM VIEWS --- */}

        {/* 1. Job Form */}
        {activeTab === 'job' && (
          <form onSubmit={handleAddJob} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
            {loadingCompanies ? (
              <div className="text-xs text-muted-foreground animate-pulse">Loading companies list...</div>
            ) : companies.length === 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg p-4 text-xs">
                <strong>Warning:</strong> No companies exist in your database. You must select or 
                <button 
                  type="button" 
                  onClick={() => setActiveTab('company')}
                  className="font-bold underline ml-1 hover:text-amber-700 cursor-pointer"
                >
                  Create a Company Profile
                </button> first before posting a job.
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-1.5">
                  Select Company *
                </label>
                <select
                  required
                  value={jobForm.company_slug}
                  onChange={(e) => setJobForm(prev => ({ ...prev, company_slug: e.target.value }))}
                  className="w-full bg-background border border-border/80 outline-none rounded-lg py-2 px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

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

            {/* Dropzone Media Uploads */}
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
        )}

        {/* 2. Company Form */}
        {activeTab === 'company' && (
          <form onSubmit={handleAddCompany} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
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

            {/* Logo Image Upload */}
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
        )}

        {/* 3. Blog Form */}
        {activeTab === 'blog' && (
          <form onSubmit={handleAddBlog} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
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

            {/* Featured Image Uploader */}
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
        )}

        {/* 4. Resource Form */}
        {activeTab === 'resource' && (
          <form onSubmit={handleAddResource} className="bg-card border border-border/40 rounded-xl p-6 space-y-5 shadow-sm transition-colors">
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

            {/* Resource Files Dropzone Uploaders */}
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
        )}

      </main>
    </div>
  );
}
