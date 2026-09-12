import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2, Image as ImageIcon, Upload, X } from 'lucide-react';

export const AdminProjects = ({ triggerToast }) => {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    description: '',
    tags: 'React, TypeScript, Tailwind CSS',
    github: '',
    live: '',
    media: '',
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
      description: '',
      tags: 'React, TypeScript, Tailwind CSS',
      github: '',
      live: '',
      media: '',
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description *</label>
            <textarea
              rows={2}
              required
              placeholder="Brief summary of architecture and impact..."
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
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

            {/* Media Preview */}
            {projectForm.media && (
              <div className="relative mt-2 rounded-lg overflow-hidden border border-white/10 bg-zinc-950 h-32 w-full max-w-sm">
                <img
                  src={projectForm.media}
                  alt="Project Media Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-zinc-300">
                  Preview
                </div>
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
                    description: '',
                    tags: 'React, TypeScript, Tailwind CSS',
                    github: '',
                    live: '',
                    media: '',
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
          Existing Projects ({data.projects.length})
        </h4>
        {data.projects.map((p) => (
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
                    media: p.media || '',
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
