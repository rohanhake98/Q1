import React from 'react';
import { Icon } from '@iconify/react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-14 pb-16 border-t border-border bg-background text-foreground transition-colors duration-300">
      <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div>
          <div className="flex items-center gap-[11px] font-semibold text-[17px] tracking-[-0.02em] text-foreground">
            <img
              alt="Q1clicks logo"
              width="30"
              height="30"
              className="rounded-lg flex-none select-none"
              src="/qlogo.jpg"
            />
            Q1clicks
          </div>
          <p className="text-muted-foreground text-sm mt-3 max-w-[34ch]">Glass-box autofill. The extension fills; you submit.</p>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground/70 font-semibold mb-4">Product</h4>
          <ul className="flex flex-col gap-2.5">
            <li><a href="/#how" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">How it works</a></li>
            <li><a href="/#platforms" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">Platforms</a></li>
            <li><a href="/#pricing" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">Pricing</a></li>
            <li><a href="/#faq" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground/70 font-semibold mb-4">Autofill by ATS</h4>
          <ul className="flex flex-col gap-2.5">
            <li><a href="/#platforms" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">Greenhouse autofill</a></li>
            <li><a href="/#platforms" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">Lever autofill</a></li>
            <li><a href="/#platforms" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">Ashby autofill</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground/70 font-semibold mb-4">Legal</h4>
          <ul className="flex flex-col gap-2.5">
            <li><a href="/#" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">Privacy</a></li>
            <li><a href="/#" className="text-[14.5px] text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline">Terms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground/70 font-semibold mb-4">Connect</h4>
          <div className="flex items-center gap-3">
            <a href="https://github.com/NurmukhamedKZ" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-border grid place-items-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200" aria-label="GitHub">
              <Icon icon="lucide:github" className="text-lg" />
            </a>
            <a href="https://x.com/Nurmukhamed_KZ" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-border grid place-items-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200" aria-label="Twitter">
              <Icon icon="ri:twitter-x-fill" className="text-base" />
            </a>
            <a href="https://www.linkedin.com/company/otclickus/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-border grid place-items-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200" aria-label="LinkedIn">
              <Icon icon="lucide:linkedin" className="text-base" />
            </a>
          </div>
          <div className="font-mono text-[11.5px] tracking-[0.06em] text-muted-foreground/70 mt-4 leading-[2]">
            <div className="text-muted-foreground">Works on <b className="text-emerald-700 font-semibold">any company form</b> · <b className="text-emerald-700 font-semibold">any ATS</b></div>
            <div>Q1clicks – 2026</div>
            <div>Apply well, not often.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
