import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2, Image as ImageIcon, Upload, X } from 'lucide-react';
import { MediaAlignmentStudio } from './MediaAlignmentStudio';

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
    media: '',
    mediaScale: 100,
    mediaX: 0,
    mediaY: 0,
    mediaFit: 'cover',
    mediaRatio: '16/9',
  });

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, media: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
      media: '',
      mediaScale: 100,
      mediaX: 0,
      mediaY: 0,
      mediaFit: 'cover',
      mediaRatio: '16/9',
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono flex items-center justify-between">
          <span>{editingItem ? 'Edit Co-Curricular Entry' : 'Add Co-Curricular Achievement (Beyond Data)'}</span>
          <span className="text-[11px] font-normal text-zinc-400 font-sans">Media cleanly attached to description</span>
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
                className="glass-input w-full px-3.5 py-2 text-sm bg-zinc-900 text-white"
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-zinc-400">Description / Key Pointers *</label>
              <span className="text-[10px] font-mono text-zinc-500">Tip: Use bullet points (• or -) or newlines</span>
            </div>
            <textarea
              rows={4}
              required
              placeholder="• Organized university technical hackathon&#10;• Mentored 200+ aspiring engineers&#10;• Spearheaded community workshops"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm leading-relaxed"
            />
          </div>

          {/* Media / Image Section */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-zinc-400" />
                <span>Entry Media / Photo (Attached directly to description)</span>
              </label>
              {form.media && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, media: '' })}
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
                  placeholder="https://... or photo URL"
                  value={form.media || ''}
                  onChange={(e) => setForm({ ...form, media: e.target.value })}
                  className="glass-input w-full px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Or Upload Local Image / Photo</label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-dashed border-white/20 hover:border-white/40 cursor-pointer text-xs text-zinc-300 hover:text-white transition-all">
                  <Upload size={13} />
                  <span>Choose Photo File</span>
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
            {form.media && (
              <div className="pt-2">
                <MediaAlignmentStudio
                  media={form.media}
                  mediaScale={form.mediaScale || 100}
                  mediaX={form.mediaX || 0}
                  mediaY={form.mediaY || 0}
                  mediaFit={form.mediaFit || 'cover'}
                  mediaRatio={form.mediaRatio || '16/9'}
                  onChange={(alignData) => setForm((prev) => ({ ...prev, ...alignData }))}
                  title="Entry Media Framing Studio"
                  subtitle="Preview your initiative photo. Adjust zoom, positioning, and aspect ratio (16:9 widescreen or original) to frame it perfectly."
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Key Impact / Highlight Metric</label>
            <input
              type="text"
              placeholder="e.g. 500+ Attendees, Top Prize Winner"
              value={form.highlight || ''}
              onChange={(e) => setForm({ ...form, highlight: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
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
                    media: '',
                    mediaScale: 100,
                    mediaX: 0,
                    mediaY: 0,
                    mediaFit: 'cover',
                    mediaRatio: '16/9',
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
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {item.media ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                  <img src={item.media} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg shrink-0 border border-white/10 bg-zinc-900 flex items-center justify-center text-zinc-600">
                  <ImageIcon size={18} />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-bold text-white truncate">{item.title}</div>
                  {item.media && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
                      Media attached
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  {item.organization} • {item.category} ({item.period})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setForm({
                    ...item,
                    media: item.media || '',
                    mediaScale: item.mediaScale ?? 100,
                    mediaX: item.mediaX ?? 0,
                    mediaY: item.mediaY ?? 0,
                    mediaFit: item.mediaFit || 'cover',
                    mediaRatio: item.mediaRatio || '16/9',
                  });
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => deleteBeyondData(item.id)}
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