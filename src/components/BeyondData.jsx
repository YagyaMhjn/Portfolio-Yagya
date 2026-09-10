import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sparkles, Trophy, Users, Megaphone, GitPullRequest, Bookmark } from 'lucide-react';

export const BeyondData = () => {
  const { data } = usePortfolio();
  const { beyondData } = data;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(beyondData.map((b) => b.category).filter(Boolean))];

  const filteredItems = beyondData.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'leadership & community':
        return <Users size={15} />;
      case 'competitions':
        return <Trophy size={15} />;
      case 'public speaking':
        return <Megaphone size={15} />;
      case 'open source':
        return <GitPullRequest size={15} />;
      default:
        return <Bookmark size={15} />;
    }
  };

  return (
    <section id="beyond-data" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-4">
            <span>✦</span> CO-CURRICULAR & LEADERSHIP <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Beyond Data
          </h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto">
            Extra co-curricular achievements, leadership initiatives, technical community contributions, and hackathon milestones.
          </p>

          {/* Filter tabs */}
          {categories.length > 1 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    activeCategory === cat
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-zinc-900/90 text-zinc-400 border border-white/[0.08] hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-panel-hover p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
                    {getCategoryIcon(item.category)}
                    <span>{item.category || 'Co-Curricular'}</span>
                  </div>

                  <span className="text-xs font-mono text-zinc-400">{item.period}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-zinc-200 transition-colors">
                  {item.title}
                </h3>

                <div className="text-xs font-mono text-zinc-400 mb-4 flex items-center gap-1.5">
                  <span>{item.organization}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {item.highlight && (
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Key Impact</span>
                  <span className="text-xs font-bold font-mono text-white px-2.5 py-1 rounded bg-black/40 border border-white/10">
                    {item.highlight}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};