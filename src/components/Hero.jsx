import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowDown, ExternalLink, Send, Sparkles, Code2, Layers, Clock, Quote } from 'lucide-react';

export const Hero = () => {
  const { data } = usePortfolio();
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

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Text */}
          <div className="lg:col-span-8 flex flex-col items-start">
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/[0.09] text-[11px] uppercase tracking-widest text-zinc-300 font-mono mb-6">
              <span className="text-white">✦</span>
              <span>{profile.role || 'FULL-STACK & AI SYSTEMS ARCHITECTURE'}</span>
              <span className="text-white">✦</span>
            </div>

            {/* Name Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
              Hi, I'm <span className="underline decoration-zinc-700 decoration-2 underline-offset-8">{profile.name}</span>
            </h1>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed mb-8 font-light">
              {profile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5"
              >
                <span>Explore Work</span>
                <span className="text-xs">↗</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/90 text-zinc-200 border border-white/10 font-medium text-sm hover:bg-zinc-800 hover:text-white transition-all transform hover:-translate-y-0.5"
              >
                <Send size={14} className="text-zinc-400" />
                <span>Get in Touch</span>
              </a>
            </div>
          </div>

          {/* Right Visual Orbit Badge */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Subtle outer rotating ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-orbit-spin" />
              {/* Middle glowing glass ring */}
              <div className="absolute inset-3 rounded-full border border-white/10 bg-zinc-950/60 backdrop-blur-md shadow-2xl" />
              
              {/* Satellite node */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

              {/* Center Celestial Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                <span className="text-3xl sm:text-4xl text-white mb-2">✦</span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">YAGYA.DEV</span>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">EST. 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          
          {/* Bento Tile 1: Status & Live Clock */}
          <div className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
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
          <div className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-4">
                ENGINEERING METRICS
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
                  <div className="text-3xl font-extrabold text-white font-mono">{projects?.length || 6}+</div>
                  <div className="text-xs text-zinc-400 mt-1">Projects Engineered</div>
                </div>
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
                  <div className="text-3xl font-extrabold text-white font-mono">{skills?.length || 20}+</div>
                  <div className="text-xs text-zinc-400 mt-1">Core Technologies</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <span>Code Base Cleanliness</span>
              <span className="font-mono text-zinc-200">100% Type-Safe</span>
            </div>
          </div>

          {/* Bento Tile 3: Primary Tech Cloud */}
          <div className="glass-card glass-panel-hover p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-3">
                PRIMARY STACK
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.primaryTech?.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:border-white/20 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <span>Architecture</span>
              <span className="font-mono text-zinc-200">Scalable & Modular</span>
            </div>
          </div>

        </div>

        {/* Guiding Principles Slider */}
        {profile.principles && profile.principles.length > 0 && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Quote size={13} className="text-zinc-400" /> Guiding Engineering Principles
              </span>
              <div className="flex gap-1.5">
                {profile.principles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-6 bg-white' : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="min-h-[70px] flex flex-col justify-center">
              <p className="text-sm sm:text-base text-zinc-200 italic font-light leading-relaxed">
                "{profile.principles[activeSlide]?.quote}"
              </p>
              <div className="text-xs text-zinc-500 font-mono mt-2">
                — {profile.principles[activeSlide]?.author}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
