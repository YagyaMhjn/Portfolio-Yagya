import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Trophy, Users, Megaphone, GitPullRequest, Bookmark } from 'lucide-react';
import { SocialBar } from './SocialHandleButton';

export const BeyondData = () => {
  const { data } = usePortfolio();
  const { beyondData, profile } = data;
  const [activeCategory, setActiveCategory] = useState('All');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

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
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clean Separation Line (No shadow) */}
        <div className="mb-8 pb-6 border-b-2 border-black/20 dark:border-white/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5">
            <span>✦</span> CO-CURRICULAR & LEADERSHIP <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Beyond Data
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            Extra co-curricular achievements, leadership initiatives, technical community contributions, and hackathon milestones.
          </p>
        </div>

        {/* Filter tabs */}
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105'
                    : 'bg-zinc-900/90 text-zinc-400 border border-white/[0.08] hover:text-white hover:border-white/30 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onMouseMove={handleMouseMove}
              className="glass-card glass-panel-hover p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.06] text-[11px] font-mono text-zinc-300 group-hover:border-white/20 transition-colors">
                    {getCategoryIcon(item.category)}
                    <span>{item.category || 'Co-Curricular'}</span>
                  </div>

                  <span className="text-xs font-mono text-zinc-400">{item.period}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-zinc-100 transition-colors">
                  {item.title}
                </h3>

                <div className="text-xs font-mono text-zinc-400 mb-4 flex items-center gap-1.5">
                  <span>{item.organization}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Media attached directly to description (Increased length, supporting 16:9 widescreen or original ratio) */}
                {item.media && (
                  <div className={`rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950/80 w-full mb-6 flex items-center justify-center relative ${
                    item.mediaRatio === '4/3' ? 'aspect-[4/3]' : item.mediaRatio === '1/1' ? 'aspect-square' : item.mediaRatio === 'original' ? 'max-h-80' : 'aspect-video'
                  }`}>
                    <img
                      src={item.media}
                      alt={item.title}
                      style={{
                        transform: `scale(${((item.mediaScale || 100) / 100)}) translate(${item.mediaX || 0}%, ${item.mediaY || 0}%)`,
                        transformOrigin: 'center center',
                        objectFit: item.mediaFit || (item.mediaRatio === 'original' ? 'contain' : 'cover'),
                      }}
                      className={`w-full h-full ${item.mediaFit === 'contain' ? 'object-contain' : 'object-cover'} transition-transform duration-500 ease-out`}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {item.highlight && (
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Key Impact</span>
                  <span className="text-xs font-bold font-mono text-white px-2.5 py-1 rounded bg-black/40 border border-white/10 group-hover:border-white/30 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] transition-all">
                    {item.highlight}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};