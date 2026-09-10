import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus } from 'lucide-react';

export const AdminBlog = ({ triggerToast }) => {
  const { addBlog, addCertificate } = usePortfolio();
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    tags: 'AI, Architecture, Full-Stack',
    readTime: '5 min read',
  });
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    credentialUrl: '',
  });

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono">Publish Technical Insight</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!blogForm.title.trim()) return;
            addBlog(blogForm);
            setBlogForm({ title: '', summary: '', tags: 'AI, Architecture', readTime: '5 min read' });
            triggerToast();
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Article Title *</label>
            <input
              type="text"
              required
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Summary / Teaser *</label>
            <textarea
              rows={2}
              required
              value={blogForm.summary}
              onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Tags</label>
              <input
                type="text"
                value={blogForm.tags}
                onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Read Time</label>
              <input
                type="text"
                value={blogForm.readTime}
                onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
          >
            <Plus size={13} /> <span>Publish Article</span>
          </button>
        </form>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        <h3 className="text-base font-bold text-white mb-4 font-mono">Add Certificate</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!certForm.title.trim()) return;
            addCertificate(certForm);
            setCertForm({ title: '', issuer: '', date: '2026', credentialUrl: '' });
            triggerToast();
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Certificate Title *</label>
              <input
                type="text"
                required
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
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Credential URL</label>
            <input
              type="url"
              value={certForm.credentialUrl}
              onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium text-xs hover:bg-zinc-800 transition-all flex items-center gap-1.5"
          >
            <Plus size={13} /> <span>Add Certificate</span>
          </button>
        </form>
      </div>
    </div>
  );
};
