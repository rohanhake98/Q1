import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleTheme }) => {
  return (
    <nav className="bg-background text-foreground border-b border-border/80 backdrop-blur-md saturate-150 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-[1180px] mx-auto px-8 py-4 flex items-center justify-between h-[75px]">
        <Link className="flex items-center gap-[11px] font-semibold text-[19px] tracking-[-0.02em] no-underline text-foreground" to="/">
          <img
            alt="Q1clicks logo"
            width="30"
            height="30"
            className="rounded-lg flex-none select-none"
            src="/qlogo.jpg"
          />
          Q1clicks
        </Link>

        <div className="flex items-center gap-[30px]">
          <a href="/#how" className="hidden md:block text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">
            How it works
          </a>
          <Link to="/jobs" className="hidden md:block text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">
            Jobs/Internship
          </Link>
          <a href="/#platforms" className="hidden md:block text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">
            Platforms
          </a>
          <a href="/#pricing" className="hidden md:block text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">
            Pricing
          </a>
          <a href="/#faq" className="hidden md:block text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">
            FAQ
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Switch theme"
            className="w-[38px] h-[38px] rounded-lg border border-border bg-transparent text-muted-foreground grid place-items-center cursor-pointer transition-colors duration-200 hover:bg-muted"
          >
            <Icon icon={darkMode ? "lucide:sun" : "lucide:moon"} className="text-lg" />
          </button>

          <a
            className="inline-flex items-center justify-center font-semibold tracking-[-0.01em] rounded-lg border cursor-pointer transition-all duration-250 ease-out whitespace-nowrap no-underline bg-zinc-900 text-zinc-50 border-zinc-800 hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-md px-[18px] py-2.5 text-sm gap-2.5 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            href="/#start"
          >
            Start free
            <Icon icon="lucide:arrow-right" className="text-sm" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
