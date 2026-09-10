import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2 } from 'lucide-react';

export const AdminSkills = ({ triggerToast }) => {
  const { data, addSkill, deleteSkill, addCategory } = usePortfolio();
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: data.categories[1] || 'Frontend',
    level: 'Advanced',
  });
  const [newCatName, setNewCatName] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
          <h3 className="text-base font-bold text-white mb-4 font-mono">Add Technology</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!skillForm.name.trim()) return;
              addSkill(skillForm);
              setSkillForm({ ...skillForm, name: '' });
              triggerToast();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Skill Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js, Kubernetes..."
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Category</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm bg-zinc-900"
              >
                {data.categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
            >
              <Plus size={13} /> <span>Add Skill</span>
            </button>
          </form>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
          <h3 className="text-base font-bold text-white mb-4 font-mono">Custom Category</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newCatName.trim()) return;
              addCategory(newCatName.trim());
              setNewCatName('');
              triggerToast();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">New Category Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Mobile Development"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium text-xs hover:bg-zinc-800 transition-all flex items-center gap-1.5"
            >
              <Plus size={13} /> <span>Create Category</span>
            </button>
          </form>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
          Active Skills Matrix ({data.skills.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.skills.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">{s.name}</div>
                <div className="text-[10px] font-mono text-zinc-400">{s.category}</div>
              </div>
              <button
                onClick={() => deleteSkill(s.id)}
                className="p-1 rounded-lg text-zinc-500 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
