import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Skillset = () => {
  const { data } = usePortfolio();
  const { skills } = data;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'ALL' },
    { id: 'Hard Skills', label: 'HARD SKILLS' },
    { id: 'Soft Skills', label: 'SOFT SKILLS' },
  ];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const filteredSkills = (skills || []).filter((skill) => {
    if (activeCategory === 'All') return true;
    const cat = skill.category?.toLowerCase() || '';
    if (activeCategory === 'Soft Skills') return cat.includes('soft');
    if (activeCategory === 'Hard Skills') return !cat.includes('soft');
    return true;
  });

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clean Separation Line (No shadow) */}
        <div className="mb-8 pb-6 border-b-2 border-black/20 dark:border-white/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5">
            <span>✦</span> TECHNICAL MATRIX <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skillset & Capabilities
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            A comprehensive ecosystem of full-stack engineering tools, AI frameworks, and architectural proficiencies.
          </p>
        </div>

        {/* Category Filter Tabs: ALL, HARD SKILLS, SOFT SKILLS */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105'
                  : 'bg-zinc-900/90 text-zinc-400 border border-white/[0.08] hover:text-white hover:border-white/30 hover:scale-105'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              onMouseMove={handleMouseMove}
              className="glass-card glass-panel-hover p-4 rounded-xl border border-white/[0.07] flex flex-col justify-between group cursor-default"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 group-hover:text-zinc-300">
                  {skill.category}
                </span>
                {!skill.category?.toLowerCase().includes('soft') && skill.level && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-300 font-mono border border-white/[0.05] group-hover:border-white/20">
                    {skill.level}
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-zinc-100 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                {skill.name}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Skillset;