import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Send, Clock, ArrowUpRight } from 'lucide-react';
import { InteractiveOwl } from './InteractiveOwl';

export const Hero = () => {
  const { data, setActivePage } = usePortfolio();
  const { profile, projects, skills } = data;
  const [time, setTime] = useState('');

  // Live IST Clock
  useEffect(() => {
    const updateClock = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat('en-GB', options).format(new Date()) + ' IST');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative overflow-hidden animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center mb-12">
          
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Kicker badge with subtle glow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-zinc-100 border border-white/[0.12] dark:border-white/[0.12] light:border-black/15 text-[11px] uppercase tracking-widest text-zinc-300 dark:text-zinc-300 light:text-zinc-800 font-mono mb-5 shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:border-white/30 transition-all cursor-default">
              <span className="text-white dark:text-white light:text-black animate-pulse">✦</span>
              <span>{profile.role || 'FULL-STACK & AI SYSTEMS ARCHITECTURE'}</span>
              <span className="text-white dark:text-white light:text-black animate-pulse">✦</span>
            </div>

            {/* Name Heading with Background Glow Effect */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white dark:text-white light:text-black mb-5 leading-[1.12]">
              Hi, I'm{' '}
              <span className="name-glow-wrapper group cursor-default">
                {/* Background Glow Aura */}
                <span className="name-glow-bg" />
                {/* Crisp Shimmer Text */}
                <span className="name-glow-text">
                  {profile.name}
                </span>
              </span>
            </h1>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-zinc-300 dark:text-zinc-300 light:text-zinc-700 max-w-2xl leading-relaxed mb-14 sm:mb-16 font-light">
              {profile.bio}
            </p>

            {/* Interactive Page Switcher CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:pt-3">
              <button
                onClick={() => setActivePage('projects')}
                className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white light:bg-black text-black dark:text-black light:text-white font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-100 light:hover:bg-zinc-800 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] group h-11"
              >
                <span>Explore Work</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              
              {/* Get in Touch Button with Perched Interactive Owl */}
              <div className="relative inline-flex items-center">
                <InteractiveOwl />
                <button
                  onClick={() => setActivePage('contact')}
                  className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white text-zinc-200 dark:text-zinc-200 light:text-zinc-900 border border-white/10 dark:border-white/10 light:border-black/15 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 transition-all group h-11"
                >
                  <Send size={14} className="text-zinc-400 dark:text-zinc-400 light:text-zinc-600 group-hover:text-white dark:group-hover:text-white light:group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                  <span>Get in Touch</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Visual Orbit Badge - Enlarged & Positioned Towards Left */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start lg:pl-4">
            <div className="animate-subtle-float flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center group cursor-pointer transition-all duration-500 ease-out hover:scale-105 sm:hover:scale-108">
                
                {/* Outer rotating SVG dashed orbit ring (Refined subtle stroke, no attached dot) */}
                <div className="absolute inset-0 flex items-center justify-center animate-orbit-spin pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="48.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeDasharray="2.8 2.8"
                      className="text-black/80 dark:text-white/70 transition-colors"
                    />
                  </svg>
                </div>
                
                {/* Middle glowing glass ring */}
                <div className="absolute inset-3 sm:inset-3.5 rounded-full border-2 border-black/25 dark:border-white/20 group-hover:border-black/50 dark:group-hover:border-white/40 bg-white/90 dark:bg-zinc-950/60 backdrop-blur-md shadow-2xl group-hover:shadow-[0_0_40px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0_0_40px_rgba(255,255,255,0.18)] transition-all overflow-hidden" />

                {/* Enriched Large Internal Profile Picture Circle with Dark Border in Light Mode */}
                <div className="relative z-10 w-52 h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64 rounded-full overflow-hidden flex items-center justify-center border-2 border-black/80 dark:border-white/30 group-hover:border-black dark:group-hover:border-white/50 transition-all shadow-[0_0_35px_rgba(0,0,0,0.2)] dark:shadow-[0_0_35px_rgba(0,0,0,0.9)] bg-white dark:bg-zinc-950">
                  <img
                    src={profile.avatar || "/profile-avatar.png"}
                    alt={profile.name || "Yagya Mahajan"}
                    style={{
                      transform: `scale(${((profile.avatarScale || 100) / 100)}) translate(${profile.avatarX || 0}%, ${profile.avatarY || 0}%)`,
                      transformOrigin: 'center center'
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out select-none"
                    loading="eager"
                  />
                  {/* Subtle glass gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-black/40 light:from-white/20 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bento Grid with Mouse Position Spotlight Glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Bento Tile 1: Status & Live Clock */}
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-400 light:text-zinc-600">AVAILABILITY STATUS</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-white light:bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-200 dark:bg-zinc-200 light:bg-zinc-800"></span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-white dark:text-white light:text-black mb-2">{profile.status}</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 leading-relaxed">{profile.statusSub}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] dark:border-white/[0.06] light:border-black/10 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-400 light:text-zinc-600 flex items-center gap-1.5 font-mono">
                <Clock size={12} /> Live Clock:
              </span>
              <span className="text-xs font-mono font-medium text-zinc-200 dark:text-zinc-200 light:text-zinc-800">{time || '--:--:-- IST'}</span>
            </div>
          </div>

          {/* Bento Tile 2: Metrics */}
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-4">
                ENGINEERING METRICS
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setActivePage('projects')}
                  className="bg-black/40 dark:bg-black/40 light:bg-zinc-100 p-3.5 rounded-xl border border-white/[0.06] dark:border-white/[0.06] light:border-black/10 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="text-3xl font-extrabold text-white dark:text-white light:text-black font-mono">{projects?.length || 6}+</div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mt-1">Projects Engineered ↗</div>
                </div>
                <div
                  onClick={() => setActivePage('skillset')}
                  className="bg-black/40 dark:bg-black/40 light:bg-zinc-100 p-3.5 rounded-xl border border-white/[0.06] dark:border-white/[0.06] light:border-black/10 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="text-3xl font-extrabold text-white dark:text-white light:text-black font-mono">{skills?.length || 20}+</div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mt-1">Core Technologies ↗</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] dark:border-white/[0.06] light:border-black/10 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
              <span>Code Base Architecture</span>
              <span className="font-mono text-zinc-200 dark:text-zinc-200 light:text-zinc-800">100% Modular</span>
            </div>
          </div>

          {/* Bento Tile 3: Primary Tech Cloud */}
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-400 light:text-zinc-600 mb-3">
                PRIMARY STACK
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.primaryTech?.map((t, idx) => (
                  <span
                    key={idx}
                    onClick={() => setActivePage('skillset')}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border border-white/[0.08] dark:border-white/[0.08] light:border-black/10 text-zinc-300 dark:text-zinc-300 light:text-zinc-800 hover:text-white dark:hover:text-white light:hover:text-black hover:border-white/30 hover:scale-105 transition-all cursor-pointer"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] dark:border-white/[0.06] light:border-black/10 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600">
              <span>Architecture</span>
              <span className="font-mono text-zinc-200 dark:text-zinc-200 light:text-zinc-800">Zero Latency</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};