import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2, Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';
import { MediaAlignmentStudio } from './MediaAlignmentStudio';
import { compressImageFile } from '../utils/imageCompressor';
import { sortCertificatesLatestFirst } from '../utils/dateUtils';
import { deduplicateSkills, findDuplicateSkills } from '../utils/skillUtils';

export const AdminCertificates = ({ triggerToast }) => {
  const { data, addCertificate, updateCertificate, deleteCertificate } = usePortfolio();
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    credentialUrl: '',
    media: '',
    mediaScale: 100,
    mediaX: 0,
    mediaY: 0,
    mediaFit: 'contain',
    mediaRatio: '16/9',
    skills: 'Machine Learning, Cloud Architecture',
  });

  const duplicateSkills = findDuplicateSkills(certForm.skills);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImageFile(file);
        setCertForm((prev) => ({ ...prev, media: compressedDataUrl }));
      } catch (err) {
        console.error('Failed to compress certificate file', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCertForm((prev) => ({ ...prev, media: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!certForm.title.trim()) return;

    const skillsArray = deduplicateSkills(certForm.skills);

    const payload = {
      ...certForm,
      skills: skillsArray,
    };

    if (editingCert) {
      updateCertificate(editingCert.id, payload);
      setEditingCert(null);
    } else {
      addCertificate(payload);
    }

    setCertForm({
      title: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      credentialUrl: '',
      media: '',
      mediaScale: 100,
      mediaX: 0,
      mediaY: 0,
      mediaFit: 'contain',
      mediaRatio: '16/9',
      skills: 'Machine Learning, Cloud Architecture',
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono flex items-center justify-between">
          <span>{editingCert ? 'Edit Certificate' : 'Add New Certificate'}</span>
          <span className="text-[11px] font-normal text-zinc-400 font-sans">Hover pop-up effect enabled on cards</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Certificate Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Certified Solutions Architect"
                value={certForm.title}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Issuer Institution *</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon Web Services, DeepLearning.AI"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Date / Year *</label>
              <input
                type="text"
                required
                placeholder="2024"
                value={certForm.date}
                onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Credential URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={certForm.credentialUrl}
                onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          {/* Media / Certificate Image Section */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-zinc-400" />
                <span>Certificate Media / Badge / Image (Pops upward on hover)</span>
              </label>
              {certForm.media && (
                <button
                  type="button"
                  onClick={() => setCertForm({ ...certForm, media: '' })}
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
                  placeholder="https://... or certificate image URL"
                  value={certForm.media || ''}
                  onChange={(e) => setCertForm({ ...certForm, media: e.target.value })}
                  className="glass-input w-full px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Or Upload Local Image / PDF Snapshot</label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-dashed border-white/20 hover:border-white/40 cursor-pointer text-xs text-zinc-300 hover:text-white transition-all">
                  <Upload size={13} />
                  <span>Choose Certificate File</span>
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
            {certForm.media && (
              <div className="pt-2">
                <MediaAlignmentStudio
                  media={certForm.media}
                  mediaScale={certForm.mediaScale || 100}
                  mediaX={certForm.mediaX || 0}
                  mediaY={certForm.mediaY || 0}
                  mediaFit={certForm.mediaFit || 'contain'}
                  mediaRatio={certForm.mediaRatio || '16/9'}
                  onChange={(alignData) => setCertForm((prev) => ({ ...prev, ...alignData }))}
                  title="Certificate Media Framing Studio"
                  subtitle="Preview your certificate badge or snapshot. Choose 16:9 widescreen or original ratio, and zoom or drag to fit."
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Associated Skills (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Neural Networks, Python, Cloud Systems"
              value={Array.isArray(certForm.skills) ? certForm.skills.join(', ') : certForm.skills}
              onChange={(e) => setCertForm({ ...certForm, skills: e.target.value })}
              className={`glass-input w-full px-3.5 py-2 text-sm font-mono transition-colors ${
                duplicateSkills.length > 0 ? 'border-amber-500/70 focus:border-amber-400' : ''
              }`}
            />
            {duplicateSkills.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-amber-400">
                <AlertCircle size={12} className="shrink-0" />
                <span>
                  Duplicate skill in this certificate: {duplicateSkills.map((d) => `"${d}"`).join(', ')}. Each skill can only be listed once per certificate panel.
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={13} />
              <span>{editingCert ? 'Update Certificate' : 'Add Certificate'}</span>
            </button>
            {editingCert && (
              <button
                type="button"
                onClick={() => {
                  setEditingCert(null);
                  setCertForm({
                    title: '',
                    issuer: '',
                    date: new Date().getFullYear().toString(),
                    credentialUrl: '',
                    media: '',
                    mediaScale: 100,
                    mediaX: 0,
                    mediaY: 0,
                    mediaFit: 'contain',
                    mediaRatio: '16/9',
                    skills: '',
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
          Active Certificates ({data.certificates?.length || 0}) • Arranged Latest First
        </h4>
        {sortCertificatesLatestFirst(data.certificates || []).map((c) => (
          <div
            key={c.id}
            className="glass-card p-4 rounded-xl border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {c.media ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-900">
                  <img src={c.media} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg shrink-0 border border-white/10 bg-zinc-900 flex items-center justify-center text-zinc-600">
                  <ImageIcon size={18} />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white truncate">{c.title}</span>
                  {c.media && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
                      Media attached
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-zinc-400">{c.issuer} • {c.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditingCert(c);
                  setCertForm({
                    ...c,
                    media: c.media || '',
                    mediaScale: c.mediaScale ?? 100,
                    mediaX: c.mediaX ?? 0,
                    mediaY: c.mediaY ?? 0,
                    mediaFit: c.mediaFit || 'contain',
                    mediaRatio: c.mediaRatio || '16/9',
                    skills: Array.isArray(c.skills) ? c.skills.join(', ') : c.skills,
                  });
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => deleteCertificate(c.id)}
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