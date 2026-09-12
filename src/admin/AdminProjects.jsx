import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2, Image as ImageIcon, Upload, X, Calendar } from 'lucide-react';
import { MediaAlignmentStudio } from './MediaAlignmentStudio';
import { sortProjectsLatestFirst } from '../utils/dateUtils';

export const AdminProjects = ({ triggerToast }) => {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    dates: '',
    description: '',
    tags: 'React, TypeScript, Tailwind CSS',
    github: '',
    live: '',
    media: '',
    mediaScale: 100,
    mediaX: 0,
    mediaY: 0,
    mediaFit: 'cover',
    mediaRatio: '16/9',
    featured: false,
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectForm((prev) => ({ ...prev, media: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const tagsArray = typeof projectForm.tags === 'string'
      ? projectForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : projectForm.tags;

    if (editingProject) {
      updateProject(editingProject.id, { ...projectForm, tags: tagsArray });
      setEditingProject(null);
    } else {
      addProject({ ...projectForm, tags: tagsArray });
    }

    setProjectForm({
      title: '',
      category: '',
      dates: '',
      description: '',
      tags: 'React, TypeScript, Tailwind CSS',
      github: '',
      live: '',
      media: '',
      mediaScale: 100,
      mediaX: 0,
      mediaY: 0,
      mediaFit: 'cover',
      mediaRatio: '16/9',
      featured: false,
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono flex items-center justify-between">
          <span>{editingProject ? 'Edit Project' : 'Add New Project'}</span>
          <span className="text-[11px] font-normal text-zinc-400 font-sans">Hover pop-up effect enabled on cards</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-mono text-zinc-400 mb-1">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Engine"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Category *</label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend, Backend & Cloud, AI / ML"
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Dates Range / Year</label>
              <input
                type="text"
                placeholder="e.g. May 2024 - Jul 2024, 2025 - Present, or 2026"
                value={projectForm.dates || ''}
                onChange={(e) => setProjectForm({ ...projectForm, dates: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Tech Stack Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="React, TypeScript, FastAPI, PostgreSQL"
              value={projectForm.tags}
              onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-zinc-400">Description / Key Pointers *</label>
              <span className="text-[10px] font-mono text-zinc-500">Tip: Use bullet points (• or -) or newlines</span>
            </div>
            <textarea
              rows={4}
              required
              placeholder="• Analyzed data trends and system throughput&#10;• Designed scalable microservices architecture&#10;• Reduced latency by 40%"
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm leading-relaxed"
            />
          </div>

          {/* Media / Image Upload & URL Section */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-zinc-400" />
                <span>Project Media / Screenshot (Pops upward on hover)</span>
              </label>
              {projectForm.media && (
                <button
                  type="button"
                  onClick={() => setProjectForm({ ...projectForm, media: '' })}
                  className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X size={12} />
                  <span>Remove Media</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Media Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or media URL"
                  value={projectForm.media || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, media: e.target.value })}
                  className="glass-input w-full px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Or Upload Local Image</label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-dashed border-white/20 hover:border-white/40 cursor-pointer text-xs text-zinc-300 hover:text-white transition-all">
                  <Upload size={13} />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Interactive Image Framing & Alignment Studio */}
            {projectForm.media && (
              <div className="pt-2">
                <MediaAlignmentStudio
                  media={projectForm.media}
                  mediaScale={projectForm.mediaScale || 100}
                  mediaX={projectForm.mediaX || 0}
                  mediaY={projectForm.mediaY || 0}
                  mediaFit={projectForm.mediaFit || 'cover'}
                  mediaRatio={projectForm.mediaRatio || '16/9'}
                  onChange={(alignData) => setProjectForm((prev) => ({ ...prev, ...alignData }))}
                  title="Project Media Framing Studio"
                  subtitle="Preview how your project screenshot appears in 16:9 widescreen or original ratio. Click and drag or use sliders to zoom and position."
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub Repo URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={projectForm.github}
                onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://demo.app"
                value={projectForm.live}
                onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="proj_featured"
              checked={projectForm.featured}
              onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900 text-white"
            />
            <label htmlFor="proj_featured" className="text-xs text-zinc-300 font-mono">
              Mark as Featured Project
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={13} />
              <span>{editingProject ? 'Update Project' : 'Add Project'}</span>
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({
                    title: '',
                    category: '',
                    dates: '',
                    description: '',
                    tags: 'React, TypeScript, Tailwind CSS',
                    github: '',
                    live: '',
                    media: '',
                    mediaScale: 100,
                    mediaX: 0,
                    mediaY: 0,
                    mediaFit: 'cover',
                    mediaRatio: '16/9',
                    featured: false,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-xs border border-white/10 hover:bg-zinc-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          Existing Projects ({data.projects.length}) • Arranged Latest First
        </h4>
        {sortProjectsLatestFirst(data.projects).map((p) => (
          <div
            key={p.id}
            className="glass-card p-4 rounded-xl border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {p.media ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                  <img src={p.media} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg shrink-0 border border-white/10 bg-zinc-900 flex items-center justify-center text-zinc-600">
                  <ImageIcon size={18} />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="text-sm font-bold text-white truncate">{p.title}</h5>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                    {p.category}
                  </span>
                  {(p.dates || p.year) && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/80 border border-white/10 text-zinc-300 flex items-center gap-1">
                      <Calendar size={10} className="text-zinc-500 shrink-0" />
                      <span>{p.dates || p.year}</span>
                    </span>
                  )}
                  {p.media && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
                      Media attached
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{p.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditingProject(p);
                  setProjectForm({
                    ...p,
                    dates: p.dates || p.year || '',
                    media: p.media || '',
                    mediaScale: p.mediaScale ?? 100,
                    mediaX: p.mediaX ?? 0,
                    mediaY: p.mediaY ?? 0,
                    mediaFit: p.mediaFit || 'cover',
                    mediaRatio: p.mediaRatio || '16/9',
                    tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags,
                  });
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/50"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
