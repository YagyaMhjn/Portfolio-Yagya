import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp, Lock, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const { data, isAdmin, setShowAdminModal, setCurrentView } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#08080a] py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
          <span>✦</span>
          <span>© {new Date().getFullYear()} {data.profile.name}. All rights reserved.</span>
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
          >
            <span>Back to top</span>
            <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
};
