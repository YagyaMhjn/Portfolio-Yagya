import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, Lock, ShieldCheck, Terminal } from 'lucide-react';

export const Navbar = () => {
  const { data, isAdmin, setShowAdminModal, setCurrentView } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'journey', 'tech', 'projects', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Journey', href: '#journey', id: 'journey' },
    { name: 'Skillset', href: '#tech', id: 'tech' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Articles & Honors', href: '#blog', id: 'blog' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0c]/85 backdrop-blur-md border-b border-white/[0.08] shadow-2xl shadow-black/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#home"
          className="flex items-center gap-2 group text-white font-semibold text-base sm:text-lg tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="text-white/80 group-hover:rotate-45 transition-transform duration-300 text-sm">✦</span>
          <span className="font-mono tracking-wider text-sm sm:text-base text-zinc-100">
            {data.profile.name || 'Yagya Mahajan'}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121215]/80 border border-white/[0.08] rounded-full px-3 py-1.5 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                activeSection === link.id
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Admin Lock / Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isAdmin) {
                setCurrentView('admin');
              } else {
                setShowAdminModal(true);
              }
            }}
            title={isAdmin ? "Open Admin Dashboard" : "Admin Login"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isAdmin
                ? 'bg-zinc-800/80 border-white/20 text-zinc-200 hover:bg-zinc-700'
                : 'bg-black/40 border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck size={13} className="text-emerald-400" />
                <span className="hidden sm:inline">Admin Mode</span>
              </>
            ) : (
              <>
                <Lock size={12} className="text-zinc-400" />
                <span className="hidden sm:inline">Admin</span>
              </>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#0c0c0e]/95 border-b border-white/10 backdrop-blur-xl px-6 py-6 shadow-2xl">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-white text-black font-semibold'
                    : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
