import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export const AdminProjects = ({ triggerToast }) => {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Frontend',
    description: '',
    tags: 'React, TypeScript, Tailwind CSS',
    github: '',
    live: '',
    featured: false,
  });

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
      category: 'Frontend',
      description: '',
      tags: 'React, TypeScript, Tailwind CSS',
      github: '',
      live: '',
      featured: false,
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono">
          {editingProject ? 'Edit Project' : 'Add New Project'}
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
              <select
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm bg-zinc-900"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend & Cloud">Backend & Cloud</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Tools & Systems">Tools & Systems</option>
              </select>
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
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
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
                    category: 'Frontend',
                    description: '',
                    tags: 'React, TypeScript, Tailwind CSS',
                    github: '',
                    live: '',
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
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-bold text-white truncate">{p.title}</h5>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                  {p.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{p.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditingProject(p);
                  setProjectForm({
                    ...p,
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
