import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export const AdminJourney = ({ triggerToast }) => {
  const { data, addTimeline, updateTimeline, deleteTimeline } = usePortfolio();
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [timelineForm, setTimelineForm] = useState({
    title: '',
    company: '',
    dates: '',
    type: 'experience',
    description: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (editingTimeline) {
      updateTimeline(editingTimeline.id, timelineForm);
      setEditingTimeline(null);
    } else {
      addTimeline(timelineForm);
    }
    setTimelineForm({
      title: '',
      company: '',
      dates: '',
      type: 'experience',
      description: '',
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono">
          {editingTimeline ? 'Edit Milestone' : 'Add Timeline Milestone'}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Role / Title *</label>
              <input
                type="text"
                required
                value={timelineForm.title}
                onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Institution / Company *</label>
              <input
                type="text"
                required
                value={timelineForm.company}
                onChange={(e) => setTimelineForm({ ...timelineForm, company: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Dates Range *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2024 - Present"
                value={timelineForm.dates}
                onChange={(e) => setTimelineForm({ ...timelineForm, dates: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Type</label>
              <select
                value={timelineForm.type}
                onChange={(e) => setTimelineForm({ ...timelineForm, type: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm bg-zinc-900"
              >
                <option value="experience">Professional Experience</option>
                <option value="education">Academic Education</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={timelineForm.description}
              onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>{editingTimeline ? 'Update Milestone' : 'Add Milestone'}</span>
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {data.timeline.map((t) => (
          <div
            key={t.id}
            className="glass-card p-4 rounded-xl border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{t.title}</span>
                <span className="text-xs text-zinc-400">@ {t.company}</span>
              </div>
              <div className="text-xs font-mono text-zinc-500">{t.dates} • {t.type}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingTimeline(t);
                  setTimelineForm(t);
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => deleteTimeline(t.id)}
                className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400"
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
