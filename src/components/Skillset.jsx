import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Cpu, Terminal, Layers } from 'lucide-react';

export const Skillset = () => {
  const { data } = usePortfolio();
  const { skills, categories } = data;
  const [activeCategory, setActiveCategory] = useState('All');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const filteredSkills = skills.filter((skill) => {
    if (activeCategory === 'All') return true;
    return skill.category === activeCategory;
  });

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-3.5 shadow-[0_0_12px_rgba(255,255,255,0.02)]">
            <span>✦</span> TECHNICAL MATRIX <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skillset & Capabilities
          </h2>
          <p className="mt-2.5 text-sm text-zinc-400 max-w-lg mx-auto">
            A comprehensive ecosystem of full-stack engineering tools, AI frameworks, and architectural proficiencies.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105'
                  : 'bg-zinc-900/90 text-zinc-400 border border-white/[0.08] hover:text-white hover:border-white/30 hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-12">
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
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-300 font-mono border border-white/[0.05] group-hover:border-white/20">
                  {skill.level || 'Expert'}
                </span>
              </div>
              <div className="text-sm font-semibold text-white group-hover:text-white group-hover:translate-x-0.5 transition-transform">
                {skill.name}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture & Engineering Standards Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-5 rounded-xl border border-white/[0.06] flex items-start gap-3 cursor-default"
          >
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-white mt-0.5 group-hover:border-white/30 transition-colors">
              <Cpu size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">Microservices & APIs</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">High-performance REST & WebSocket streaming backends engineered with FastAPI and Node.js.</p>
            </div>
          </div>

          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-5 rounded-xl border border-white/[0.06] flex items-start gap-3 cursor-default"
          >
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-white mt-0.5 group-hover:border-white/30 transition-colors">
              <Terminal size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">AI & LLM Orchestration</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">Multi-agent pipelines, RAG retrieval with vector indices, and intelligent autonomous workflows.</p>
            </div>
          </div>

          <div
            onMouseMove={handleMouseMove}
            className="glass-card glass-panel-hover p-5 rounded-xl border border-white/[0.06] flex items-start gap-3 cursor-default"
          >
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-white mt-0.5 group-hover:border-white/30 transition-colors">
              <Layers size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-mono">Responsive Web Architecture</h4>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">Monochromatic dark layouts, ultra-fast client-side caching, and strict component modularity.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};