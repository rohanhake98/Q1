import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

interface MainLayoutProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ darkMode, onToggleTheme }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col relative transition-colors duration-300">
      <Navbar darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
