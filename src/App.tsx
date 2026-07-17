import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import OtclickGlassBoxAutofillForJobApplications from './pages/OtclickGlassBoxAutofillForJobApplications';
import JobsInternships from './pages/JobsInternships';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Sync dark mode class with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      // Update CSS variables for dark mode
      document.documentElement.style.setProperty('--background', '#121212');
      document.documentElement.style.setProperty('--foreground', '#e5e5e5');
      document.documentElement.style.setProperty('--muted', '#262626');
      document.documentElement.style.setProperty('--muted-foreground', '#a3a3a3');
      document.documentElement.style.setProperty('--card', '#1e1e1e');
      document.documentElement.style.setProperty('--card-foreground', '#e5e5e5');
      document.documentElement.style.setProperty('--border', '#047857');
    } else {
      document.documentElement.classList.remove('dark');
      // Reset CSS variables for light mode
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
        <Route 
          path="/" 
          element={
            <OtclickGlassBoxAutofillForJobApplications 
              darkMode={darkMode} 
              onToggleTheme={toggleTheme} 
            />
          } 
        />
        <Route 
          path="/jobs" 
          element={
            <JobsInternships 
              darkMode={darkMode} 
              onToggleTheme={toggleTheme} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}
