import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Save } from 'lucide-react';

export const AdminProfile = ({ triggerToast }) => {
  const { data, updateProfile } = usePortfolio();
  const [profileForm, setProfileForm] = useState(data.profile);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    triggerToast();
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
      <h3 className="text-lg font-bold text-white mb-1 font-mono">Profile & Bio Settings</h3>
      <p className="text-xs text-zinc-400 mb-6">Updates are instantly synchronized to the public portfolio.</p>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Role / Subtitle</label>
            <input
              type="text"
              value={profileForm.role}
              onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Bio Description</label>
          <textarea
            rows={3}
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            className="glass-input w-full px-3.5 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Status Title</label>
            <input
              type="text"
              value={profileForm.status}
              onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Status Subtext</label>
            <input
              type="text"
              value={profileForm.statusSub}
              onChange={(e) => setProfileForm({ ...profileForm, statusSub: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Location</label>
            <input
              type="text"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub URL</label>
            <input
              type="url"
              value={profileForm.github}
              onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all"
        >
          <Save size={13} />
          <span>Save Profile Changes</span>
        </button>
      </form>
    </div>
  );
};
