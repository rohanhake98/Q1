import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import OtclickGlassBoxAutofillForJobApplications from './pages/OtclickGlassBoxAutofillForJobApplications';
import JobsInternships from './pages/JobsInternships';
import JobDetails from './pages/JobDetails';
import CompanyDetails from './pages/CompanyDetails';
import BlogDetails from './pages/BlogDetails';
import ResourceDetails from './pages/ResourceDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/admin/Dashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Sync dark mode class with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--background', '#121212');
      document.documentElement.style.setProperty('--foreground', '#e5e5e5');
      document.documentElement.style.setProperty('--muted', '#262626');
      document.documentElement.style.setProperty('--muted-foreground', '#a3a3a3');
      document.documentElement.style.setProperty('--card', '#1e1e1e');
      document.documentElement.style.setProperty('--card-foreground', '#e5e5e5');
      document.documentElement.style.setProperty('--border', '#047857');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--background', '#f5f4f0');
      document.documentElement.style.setProperty('--foreground', '#54534e');
      document.documentElement.style.setProperty('--muted', '#ebeae6');
      document.documentElement.style.setProperty('--muted-foreground', '#9c9b97');
      document.documentElement.style.setProperty('--card', '#ffffff');
      document.documentElement.style.setProperty('--card-foreground', '#54534e');
      document.documentElement.style.setProperty('--border', '#059669');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <Router>
      <Routes>
        {/* Main site pages wrapped in MainLayout containing shared Navbar + Footer */}
        <Route 
          element={
            <MainLayout 
              darkMode={darkMode} 
              onToggleTheme={toggleTheme} 
            />
          }
        >
          <Route path="/" element={<OtclickGlassBoxAutofillForJobApplications />} />
          <Route path="/jobs" element={<JobsInternships />} />
          <Route path="/jobs/:slug" element={<JobDetails />} />
          <Route path="/company/:slug" element={<CompanyDetails />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/resources/:slug" element={<ResourceDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Section (Independent Layout) */}
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
