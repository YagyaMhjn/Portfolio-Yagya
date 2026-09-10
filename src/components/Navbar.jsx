import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { data, activePage, setActivePage } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Journey', id: 'journey' },
    { name: 'Skillset', id: 'skillset' },
    { name: 'Projects', id: 'projects' },
    { name: 'Certificates', id: 'certificates' },
    { name: 'Beyond Data', id: 'beyond-data' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/[0.08] shadow-2xl shadow-black/60 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 group text-white font-semibold text-base sm:text-lg tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="text-white/80 group-hover:rotate-45 transition-transform duration-300 text-sm">✦</span>
          <span className="font-mono tracking-wider text-sm sm:text-base text-zinc-100">
            {data.profile.name || 'Yagya Mahajan'}
          </span>
        </button>

        {/* Desktop Multi-Page Switcher Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#121215]/90 border border-white/[0.08] rounded-full p-1 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                activePage === link.id
                  ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[57px] bg-[#0c0c0e]/98 border-b border-white/10 backdrop-blur-xl px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activePage === link.id
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};