import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, ChevronRight } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggle';

export const Navbar = () => {
  const { data, activePage, setActivePage, theme } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const isLight = theme === 'light';

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Journey', id: 'journey' },
    { name: 'Skillset', id: 'skillset' },
    { name: 'Projects', id: 'projects' },
    { name: 'Certificates', id: 'certificates' },
    { name: 'Beyond Data', id: 'beyond-data' },
    { name: 'Contact', id: 'contact' },
  ];

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch handlers for swipe-to-close gesture (swiping right closes drawer)
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    if (diff > 50) {
      setMobileMenuOpen(false);
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  // Close menu and stay on current screen
  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  // Select section: slide panel out, fade blur, then show section loading screen
  const handleSelectSection = (targetId) => {
    setMobileMenuOpen(false);
    if (targetId === activePage) return;
    // Wait for the panel to slide out to the right and blur to fade out (280ms)
    // before triggering the section transition loader
    setTimeout(() => {
      setActivePage(targetId);
    }, 280);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-200 py-3.5 ${
          isLight
            ? 'bg-white/90 border-zinc-200/80 shadow-sm'
            : 'bg-[#0a0a0c]/90 border-white/[0.08] shadow-2xl shadow-black/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => {
              if (activePage !== 'home') {
                handleSelectSection('home');
              } else {
                handleCloseMenu();
              }
            }}
            className={`flex items-center gap-2 group font-semibold text-base sm:text-lg tracking-tight hover:opacity-90 transition-opacity ${
              isLight ? 'text-zinc-900' : 'text-white'
            }`}
          >
            <span className="text-amber-500 dark:text-white/80 group-hover:rotate-45 transition-transform duration-300 text-sm">
              ✦
            </span>
            <span className="font-mono tracking-wider text-sm sm:text-base">
              {data.profile.name || 'Yagya Mahajan'}
            </span>
          </button>

          {/* Desktop Multi-Page Switcher Navigation & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <nav
              className={`flex items-center gap-1 border rounded-full p-1 backdrop-blur-md shadow-inner transition-colors ${
                isLight
                  ? 'bg-zinc-100/90 border-zinc-200'
                  : 'bg-[#121215]/90 border-white/[0.08]'
              }`}
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    activePage === link.id
                      ? isLight
                        ? 'bg-black text-white font-bold shadow-md'
                        : 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                      : isLight
                      ? 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Theme Toggle Button */}
            <ThemeToggleButton />
          </div>

          {/* Mobile Controls (Theme Toggle + Hamburger Menu Button) */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggleButton />
            <button
              onClick={() => {
                if (mobileMenuOpen) {
                  handleCloseMenu();
                } else {
                  setMobileMenuOpen(true);
                }
              }}
              className={`p-2 rounded-lg border transition-colors ${
                isLight
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-200'
                  : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop (Smooth background blur fade in/out) */}
      <div
        onClick={handleCloseMenu}
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? 'opacity-100 backdrop-blur-md bg-black/40 dark:bg-black/60 pointer-events-auto visible'
            : 'opacity-0 backdrop-blur-none bg-transparent pointer-events-none invisible'
        }`}
        aria-hidden="true"
      />

      {/* Mobile Floating Glass-Card Panel (Matches Projects, Certificates & Beyond Data cards) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`lg:hidden fixed top-16 right-3 bottom-4 sm:top-20 sm:right-6 sm:bottom-6 z-[70] w-[calc(100vw-24px)] max-w-[320px] rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
          isLight
            ? 'bg-white/95 border border-black/15 text-zinc-900 backdrop-blur-xl'
            : 'bg-[#0c0c10]/95 border border-white/15 text-white backdrop-blur-xl'
        } ${
          mobileMenuOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto visible shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
            : 'translate-x-[120%] opacity-0 pointer-events-none invisible shadow-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation panel"
      >
        {/* Panel Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isLight ? 'border-black/10' : 'border-white/[0.08]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-500 dark:text-white/80 text-sm">✦</span>
            <span
              className={`font-mono text-xs uppercase tracking-widest font-semibold ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}
            >
              Navigation
            </span>
          </div>
          <button
            onClick={handleCloseMenu}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight
                ? 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-200'
                : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex flex-col gap-1.5 px-3 py-3 overflow-y-auto flex-1">
          {navLinks.map((link, idx) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleSelectSection(link.id)}
                className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? 'bg-black text-white font-bold shadow-md'
                      : 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                    : isLight
                    ? 'text-zinc-700 hover:text-black hover:bg-black/5'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs ${
                      isActive
                        ? isLight
                          ? 'text-zinc-400'
                          : 'text-zinc-500'
                        : 'text-zinc-400 dark:text-zinc-600'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="tracking-wide text-sm">{link.name}</span>
                </div>
                {isActive ? (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLight ? 'bg-white' : 'bg-black'
                    }`}
                  />
                ) : (
                  <ChevronRight
                    size={14}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-zinc-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Panel Footer */}
        <div
          className={`p-4 border-t ${
            isLight
              ? 'border-black/10 bg-zinc-50/80'
              : 'border-white/[0.08] bg-zinc-900/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span
              className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                isLight ? 'text-zinc-700' : 'text-zinc-300'
              }`}
            >
              {data.profile.status || 'Open to Opportunities'}
            </span>
          </div>
          <p
            className={`text-xs font-mono line-clamp-1 ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            {data.profile.statusSub || data.profile.location || 'Punjab, India'}
          </p>
        </div>
      </div>
    </>
  );
};