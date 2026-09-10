import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Search, FolderGit2, Star } from 'lucide-react';
import { GithubIcon } from './Icons';
import { SocialBar } from './SocialHandleButton';

export const Projects = () => {
  const { data } = usePortfolio();
  const { projects, profile } = data;

  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set(['All']);
    projects.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTag =
        selectedTag === 'All' ||
        (Array.isArray(project.tags) && project.tags.includes(selectedTag)) ||
        project.category === selectedTag;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (Array.isArray(project.tags) && project.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesTag && matchesSearch;
    });
  }, [projects, selectedTag, searchQuery]);

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 pb-6 border-b border-white/[0.06]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5 shadow-[0_0_12px_rgba(255,255,255,0.02)]">
            <span>✦</span> CURATED PORTFOLIO <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            A curated showcase of full-stack web applications, AI agent systems, and distributed platforms.
          </p>
        </div>

        {/* Filters & Search Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {allTags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105'
                    : 'bg-zinc-900/90 text-zinc-400 border border-white/[0.08] hover:text-white hover:border-white/30 hover:scale-105'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9 pr-4 py-2 text-xs font-mono placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center border border-white/[0.08]">
            <FolderGit2 size={36} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-sm">No projects matching the filter "{selectedTag}".</p>
            <button
              onClick={() => {
                setSelectedTag('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-xs text-white border border-white/10 hover:bg-zinc-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onMouseMove={handleMouseMove}
                className="glass-card glass-panel-hover rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between group relative cursor-default transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] group-hover:border-white/20 transition-colors">
                      {project.category || 'Engineering'}
                    </span>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 border border-white/[0.08] hover:border-white/30 transition-all"
                          title="View GitHub Repository"
                        >
                          <GithubIcon size={14} />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 border border-white/[0.08] hover:border-white/30 transition-all"
                          title="View Live Demo"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Upward Hover Pop-Up Media Preview */}
                  {project.media && (
                    <div className="relative mb-4.5 rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950/80 h-44 sm:h-48 w-full group/media transition-all duration-300 ease-out transform group-hover:-translate-y-3.5 group-hover:scale-[1.02] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(255,255,255,0.18)] group-hover:border-white/40 group-hover:ring-1 group-hover:ring-white/20 z-10">
                      <img
                        src={project.media}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors flex items-center gap-1.5">
                    <span>{project.title}</span>
                    {project.featured && <Star size={13} className="text-zinc-300 fill-zinc-300 animate-pulse" />}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light mb-6">
                    {project.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                    {Array.isArray(project.tags) &&
                      project.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-300 border border-white/[0.05] group-hover:border-white/15 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};