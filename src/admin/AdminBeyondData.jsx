import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export const AdminBeyondData = ({ triggerToast }) => {
  const { data, addBeyondData, updateBeyondData, deleteBeyondData } = usePortfolio();
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    organization: '',
    period: '2024',
    category: 'Leadership & Community',
    description: '',
    highlight: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingItem) {
      updateBeyondData(editingItem.id, form);
      setEditingItem(null);
    } else {
      addBeyondData(form);
    }

    setForm({
      title: '',
      organization: '',
      period: '2024',
      category: 'Leadership & Community',
      description: '',
      highlight: '',
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono">
          {editingItem ? 'Edit Co-Curricular Entry' : 'Add Co-Curricular Achievement (Beyond Data)'}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Title / Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Organizer, 1st Place Winner"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Organization / Event *</label>
              <input
                type="text"
                required
                placeholder="e.g. Developer Club, TechFest"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm bg-zinc-900"
              >
                <option value="Leadership & Community">Leadership & Community</option>
                <option value="Competitions">Competitions</option>
                <option value="Public Speaking">Public Speaking</option>
                <option value="Open Source">Open Source</option>
                <option value="Student Activities">Student Activities</option>
                <option value="Sports & Extra-Curricular">Sports & Extra-Curricular</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Period / Year *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2023 - 2024"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the initiative, responsibilities, and achievements..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Key Impact / Highlight Metric</label>
            <input
              type="text"
              placeholder="e.g. 500+ Attendees, Top Prize Winner"
              value={form.highlight}
              onChange={(e) => setForm({ ...form, highlight: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>{editingItem ? 'Update Entry' : 'Add Entry'}</span>
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setForm({
                    title: '',
                    organization: '',
                    period: '2024',
                    category: 'Leadership & Community',
                    description: '',
                    highlight: '',
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
          Beyond Data Entries ({data.beyondData?.length || 0})
        </h4>
        {data.beyondData?.map((item) => (
          <div
            key={item.id}
            className="glass-card p-4 rounded-xl border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div>
              <div className="text-sm font-bold text-white">{item.title}</div>
              <div className="text-xs font-mono text-zinc-400">
                {item.organization} • {item.category} ({item.period})
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setForm(item);
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => deleteBeyondData(item.id)}
                className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/50"
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