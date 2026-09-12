import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { SocialBar } from './SocialHandleButton';
import { ContentRenderer } from './ContentRenderer';

export const Journey = () => {
  const { data } = usePortfolio();
  const { timeline, profile } = data;
  const [filterType, setFilterType] = useState('all');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const filteredTimeline = timeline.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clean Separation Line (No shadow) */}
        <div className="mb-8 pb-6 border-b-2 border-black/20 dark:border-white/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5">
            <span>✦</span> CAREER TIMELINE & EDUCATION <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional Journey
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            A chronological roadmap of engineering roles, software projects, and academic foundations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center md:justify-start mb-8">
          <div className="inline-flex p-1 rounded-xl bg-zinc-900/90 border border-white/[0.08]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'all' ? 'bg-white text-black font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Milestones
            </button>
            <button
              onClick={() => setFilterType('experience')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'experience' ? 'bg-white text-black font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setFilterType('education')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'education' ? 'bg-white text-black font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Education
            </button>
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-zinc-800 ml-4 sm:ml-32 space-y-8">
          {filteredTimeline.map((item, idx) => {
            const isExp = item.type === 'experience';
            return (
              <div key={item.id || idx} className="relative pl-6 sm:pl-8 group">
                
                {/* Glowing Dot on Track */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0a0a0c] border-2 border-zinc-600 group-hover:border-white group-hover:shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 group-hover:bg-white" />
                </div>

                {/* Left Date label on desktop */}
                <div className="hidden sm:block absolute -left-32 top-1.5 w-24 text-right">
                  <span className="text-xs font-mono text-zinc-400 tracking-tight">{item.dates}</span>
                </div>

                {/* Card with Spotlight */}
                <div
                  onMouseMove={handleMouseMove}
                  className="glass-card glass-panel-hover p-6 rounded-2xl border border-white/[0.08] cursor-default"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-zinc-300 group-hover:border-white/30 transition-colors">
                        {isExp ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    </div>
                    <span className="sm:hidden text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
                      {item.dates}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-zinc-400 mb-3 flex flex-wrap items-center gap-1.5">
                    <span>{item.company}</span>
                    {item.location && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400">
                          <MapPin size={12} className="text-zinc-500" />
                          <span>{item.location}</span>
                        </span>
                      </>
                    )}
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs uppercase tracking-wider font-mono text-zinc-500">
                      {isExp ? 'Professional' : 'Academic'}
                    </span>
                  </div>

                  {item.description && (
                    <ContentRenderer content={item.description} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};