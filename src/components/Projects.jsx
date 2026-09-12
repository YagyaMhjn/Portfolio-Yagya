import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { FolderGit2, Star, ExternalLink, Calendar } from 'lucide-react';
import { GithubIcon } from './Icons';
import { ContentRenderer } from './ContentRenderer';
import { sortProjectsLatestFirst } from '../utils/dateUtils';

const useProjectColumnCount = () => {
  const getCols = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const [cols, setCols] = useState(getCols);

  useEffect(() => {
    const onResize = () => setCols(getCols());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return cols;
};

export const Projects = () => {
  const { data } = usePortfolio();
  const { projects } = data;
  const numCols = useProjectColumnCount();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Arrange projects chronologically (latest first)
  const sortedProjects = sortProjectsLatestFirst(projects || []);

  const columns = Array.from({ length: numCols }, () => []);
  sortedProjects.forEach((proj, idx) => {
    columns[idx % numCols].push(proj);
  });

  const renderProjectCard = (project) => (
    <div
      key={project.id}
      onMouseMove={handleMouseMove}
      className="glass-card glass-panel-hover rounded-2xl border border-white/[0.08] hover:border-white/30 overflow-hidden flex flex-col justify-between group relative cursor-default transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
    >
      <div>
        {/* Revealed Top Media on Hover (Expands smoothly to full natural height without clipping) */}
        {project.media && (
          <div className="max-h-0 opacity-0 group-hover:max-h-[1600px] group-hover:opacity-100 transition-all duration-500 delay-[250ms] group-hover:duration-400 group-hover:delay-0 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden relative bg-zinc-950 flex items-center justify-center">
            <div className={`w-full ${project.mediaRatio === '4/3' ? 'aspect-[4/3]' : project.mediaRatio === '1/1' ? 'aspect-square' : project.mediaRatio === '16/9' ? 'aspect-video' : 'h-auto'} relative overflow-hidden flex items-center justify-center`}>
              <img
                src={project.media}
                alt={project.title}
                style={{
                  transform: `scale(${((project.mediaScale || 100) / 100)}) translate(${project.mediaX || 0}%, ${project.mediaY || 0}%)`,
                  transformOrigin: 'center center',
                  objectFit: project.mediaFit || (project.mediaRatio === 'original' ? 'contain' : 'cover'),
                }}
                className={`w-full ${project.mediaRatio === 'original' ? 'h-auto max-h-[700px] object-contain' : project.mediaFit === 'contain' ? 'h-full object-contain' : 'h-full object-cover'} transition-transform duration-500 ease-out`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Card Content Body */}
        <div className="p-6">
          {/* Category badge + Dates range + Action buttons (Live Demo & GitHub) */}
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2.5 py-1 rounded bg-zinc-900/90 border border-white/[0.06] group-hover:border-white/20 transition-colors">
                {project.category || 'Engineering'}
              </span>

              {(project.dates || project.year) && (
                <span className="text-[10px] font-mono text-zinc-400 px-2 py-1 rounded bg-zinc-900/90 border border-white/[0.06] group-hover:border-white/20 transition-colors flex items-center gap-1">
                  <Calendar size={11} className="text-zinc-500 shrink-0" />
                  <span>{project.dates || project.year}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.1] hover:border-white/30 text-zinc-400 hover:text-white transition-all hover:scale-105"
                  title="Live Demo"
                >
                  <ExternalLink size={14} />
                </a>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.1] hover:border-white/30 text-zinc-400 hover:text-white transition-all hover:scale-105"
                  title="View GitHub Repository"
                >
                  <GithubIcon size={15} />
                </a>
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors flex items-center gap-1.5">
            <span>{project.title}</span>
            {project.featured && <Star size={13} className="text-zinc-300 fill-zinc-300 animate-pulse" />}
          </h3>

          <ContentRenderer content={project.description} />

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
  );

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clean Separation Line (No shadow) */}
        <div className="mb-8 pb-6 border-b-2 border-black/20 dark:border-white/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5">
            <span>✦</span> CURATED PORTFOLIO <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            A curated showcase of full-stack web applications, AI agent systems, and distributed platforms.
          </p>
        </div>

        {/* Projects Grid */}
        {(!projects || projects.length === 0) ? (
          <div className="glass-card p-12 rounded-2xl text-center border border-white/[0.08]">
            <FolderGit2 size={36} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-sm">No projects currently available.</p>
          </div>
        ) : (
          <div className={`grid ${numCols === 1 ? 'grid-cols-1' : numCols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 items-start`}>
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-6">
                {col.map((project) => renderProjectCard(project))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};