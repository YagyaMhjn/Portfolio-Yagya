import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export const AdminCertificates = ({ triggerToast }) => {
  const { data, addCertificate, updateCertificate, deleteCertificate } = usePortfolio();
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    credentialUrl: '',
    skills: 'Machine Learning, Cloud Architecture',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!certForm.title.trim()) return;

    if (editingCert) {
      updateCertificate(editingCert.id, certForm);
      setEditingCert(null);
    } else {
      addCertificate(certForm);
    }

    setCertForm({
      title: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      credentialUrl: '',
      skills: 'Machine Learning, Cloud Architecture',
    });
    triggerToast();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono">
          {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
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

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Associated Skills (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Neural Networks, Python, Cloud Systems"
              value={Array.isArray(certForm.skills) ? certForm.skills.join(', ') : certForm.skills}
              onChange={(e) => setCertForm({ ...certForm, skills: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
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
          Active Certificates ({data.certificates?.length || 0})
        </h4>
        {data.certificates?.map((c) => (
          <div
            key={c.id}
            className="glass-card p-4 rounded-xl border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div>
              <div className="text-sm font-bold text-white">{c.title}</div>
              <div className="text-xs font-mono text-zinc-400">{c.issuer} • {c.date}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingCert(c);
                  setCertForm({
                    ...c,
                    skills: Array.isArray(c.skills) ? c.skills.join(', ') : c.skills,
                  });
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => deleteCertificate(c.id)}
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