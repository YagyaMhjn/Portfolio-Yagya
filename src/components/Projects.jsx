import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { FolderGit2, Star } from 'lucide-react';
import { GithubIcon } from './Icons';

export const Projects = () => {
  const { data } = usePortfolio();
  const { projects } = data;

  const [selectedTag, setSelectedTag] = useState('All');

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
      return (
        selectedTag === 'All' ||
        (Array.isArray(project.tags) && project.tags.includes(selectedTag)) ||
        project.category === selectedTag
      );
    });
  }, [projects, selectedTag]);

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

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8">
          {allTags.map((tag) => (
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

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center border border-white/[0.08]">
            <FolderGit2 size={36} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-sm">No projects matching the filter "{selectedTag}".</p>
            <button
              onClick={() => setSelectedTag('All')}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-xs text-white border border-white/10 hover:bg-zinc-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onMouseMove={handleMouseMove}
                className="glass-card glass-panel-hover rounded-2xl border border-white/[0.08] hover:border-white/30 overflow-hidden flex flex-col justify-between group relative cursor-default transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
              >
                <div>
                  {/* Revealed Top Media on Hover (Expands smoothly from 0 height with 0.4s hold delay) */}
                  {project.media && (
                    <div className="max-h-0 opacity-0 group-hover:max-h-48 sm:group-hover:max-h-52 group-hover:opacity-100 transition-all duration-500 delay-[400ms] group-hover:duration-300 group-hover:delay-0 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden relative bg-zinc-950">
                      <img
                        src={project.media}
                        alt={project.title}
                        className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30" />
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-6">
                    {/* Category badge + Expanding "Show Repository" GitHub button */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2.5 py-1 rounded bg-zinc-900/90 border border-white/[0.06] group-hover:border-white/20 transition-colors">
                        {project.category || 'Engineering'}
                      </span>

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 min-w-[32px] px-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.12] hover:border-white/40 text-zinc-300 hover:text-white transition-all duration-300 ease-out group/gh overflow-hidden shadow-sm cursor-pointer"
                          title="Show Repository"
                        >
                          <span className="shrink-0 flex items-center justify-center text-zinc-300 group-hover/gh:text-white transition-colors">
                            <GithubIcon size={14} />
                          </span>
                          <span className="max-w-0 opacity-0 group-hover/gh:max-w-[140px] group-hover/gh:opacity-100 group-hover/gh:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-[11px] font-mono font-medium">
                            Show Repository
                          </span>
                        </a>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors flex items-center gap-1.5">
                      <span>{project.title}</span>
                      {project.featured && <Star size={13} className="text-zinc-300 fill-zinc-300 animate-pulse" />}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light mb-4">
                      {project.description}
                    </p>

                    {/* Tech stack tags */}
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
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};