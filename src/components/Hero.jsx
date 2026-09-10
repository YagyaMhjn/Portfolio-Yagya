import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Send, Clock, Quote, ArrowUpRight } from 'lucide-react';

export const Hero = () => {
  const { data, setActivePage } = usePortfolio();
  const { profile, projects, skills } = data;
  const [time, setTime] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

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

  // Quotes slider auto-rotate
  useEffect(() => {
    if (!profile.principles || profile.principles.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % profile.principles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [profile.principles]);

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          
          {/* Left Text */}
          <div className="lg:col-span-8 flex flex-col items-start">
            {/* Kicker badge with subtle glow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/[0.12] text-[11px] uppercase tracking-widest text-zinc-300 font-mono mb-5 shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:border-white/30 transition-all cursor-default">
              <span className="text-white animate-pulse">✦</span>
              <span>{profile.role || 'FULL-STACK & AI SYSTEMS ARCHITECTURE'}</span>
              <span className="text-white animate-pulse">✦</span>
            </div>

            {/* Name Heading with Background Glow Effect */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-5 leading-[1.12]">
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
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed mb-7 font-light">
              {profile.bio}
            </p>

            {/* Interactive Page Switcher CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActivePage('projects')}
                className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-100 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] group"
              >
                <span>Explore Work</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setActivePage('contact')}
                className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/90 text-zinc-200 border border-white/10 font-medium text-sm hover:bg-zinc-800 hover:text-white hover:border-white/25 transition-all group"
              >
                <Send size={14} className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                <span>Get in Touch</span>
              </button>
            </div>
          </div>

          {/* Right Visual Orbit Badge with Interactive Hover */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center group cursor-pointer">
              {/* Outer rotating ring with glow on hover */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/20 group-hover:border-white/40 animate-orbit-spin transition-colors" />
              {/* Middle glowing glass ring */}
              <div className="absolute inset-3 rounded-full border border-white/10 group-hover:border-white/30 bg-zinc-950/60 backdrop-blur-md shadow-2xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all" />
              
              {/* Satellite node */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]" />

              {/* Center Celestial Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 group-hover:scale-105 transition-transform">
                <span className="text-3xl sm:text-4xl text-white mb-1 group-hover:rotate-12 transition-transform duration-300">✦</span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">YAGYA.DEV</span>
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5">EST. 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bento Grid with Mouse Position Spotlight Glow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          
          {/* Bento Tile 1: Status & Live Clock */}
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">AVAILABILITY STATUS</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-200"></span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{profile.status}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{profile.statusSub}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
                <Clock size={12} /> Live Clock:
              </span>
              <span className="text-xs font-mono font-medium text-zinc-200">{time || '--:--:-- IST'}</span>
            </div>
          </div>

          {/* Bento Tile 2: Metrics */}
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-4">
                ENGINEERING METRICS
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setActivePage('projects')}
                  className="bg-black/40 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="text-3xl font-extrabold text-white font-mono">{projects?.length || 6}+</div>
                  <div className="text-xs text-zinc-400 mt-1">Projects Engineered ↗</div>
                </div>
                <div
                  onClick={() => setActivePage('skillset')}
                  className="bg-black/40 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="text-3xl font-extrabold text-white font-mono">{skills?.length || 20}+</div>
                  <div className="text-xs text-zinc-400 mt-1">Core Technologies ↗</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <span>Code Base Architecture</span>
              <span className="font-mono text-zinc-200">100% Modular</span>
            </div>
          </div>

          {/* Bento Tile 3: Primary Tech Cloud */}
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-default"
          >
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-3">
                PRIMARY STACK
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.primaryTech?.map((t, idx) => (
                  <span
                    key={idx}
                    onClick={() => setActivePage('skillset')}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/30 hover:bg-zinc-800 hover:scale-105 transition-all cursor-pointer"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <span>Architecture</span>
              <span className="font-mono text-zinc-200">Zero Latency</span>
            </div>
          </div>

        </div>

        {/* Guiding Principles Slider */}
        {profile.principles && profile.principles.length > 0 && (
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-6 sm:p-7 rounded-2xl border border-white/[0.08]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Quote size={13} className="text-zinc-400" /> Guiding Engineering Principles
              </span>
              <div className="flex gap-1.5">
                {profile.principles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="min-h-[60px] flex flex-col justify-center">
              <p className="text-sm sm:text-base text-zinc-200 italic font-light leading-relaxed">
                "{profile.principles[activeSlide]?.quote}"
              </p>
              <div className="text-xs text-zinc-500 font-mono mt-1.5">
                — {profile.principles[activeSlide]?.author}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};