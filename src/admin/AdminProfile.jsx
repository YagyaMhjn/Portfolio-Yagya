import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Link2, ZoomIn, ZoomOut, Move, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';
import { SocialHandleButton, getSocialIcon } from '../components/SocialHandleButton';

const PLATFORM_OPTIONS = [
  { value: 'LinkedIn', label: 'LinkedIn', defaultUrl: 'https://linkedin.com/in/', placeholder: 'https://linkedin.com/in/username' },
  { value: 'GitHub', label: 'GitHub', defaultUrl: 'https://github.com/', placeholder: 'https://github.com/username' },
  { value: 'Instagram', label: 'Instagram', defaultUrl: 'https://instagram.com/', placeholder: 'https://instagram.com/username' },
  { value: 'X (Twitter)', label: 'X (Twitter)', defaultUrl: 'https://x.com/', placeholder: 'https://x.com/username' },
  { value: 'Email', label: 'Email / Mailto', defaultUrl: 'mailto:', placeholder: 'mailto:your.email@example.com' },
  { value: 'Download CV', label: 'Download CV / Resume', defaultUrl: '#', placeholder: 'https://drive.google.com/... or /resume.pdf or #' },
  { value: 'YouTube', label: 'YouTube', defaultUrl: 'https://youtube.com/@', placeholder: 'https://youtube.com/@channel' },
  { value: 'Discord', label: 'Discord', defaultUrl: 'https://discord.gg/', placeholder: 'https://discord.gg/inviteCode' },
  { value: 'Website', label: 'Custom Website / Link', defaultUrl: 'https://', placeholder: 'https://example.com' },
];

export const AdminProfile = ({ triggerToast }) => {
  const { data, updateProfile } = usePortfolio();
  const [profileForm, setProfileForm] = useState(() => ({
    ...data.profile,
    socials: data.profile.socials || []
  }));

  // Dragging state for interactive circle avatar positioning
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: profileForm.avatarX || 0,
      initialY: profileForm.avatarY || 0,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.35;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.35;
    const newX = Math.min(60, Math.max(-60, Math.round(dragStartRef.current.initialX + deltaX)));
    const newY = Math.min(60, Math.max(-60, Math.round(dragStartRef.current.initialY + deltaY)));
    setProfileForm((prev) => ({ ...prev, avatarX: newX, avatarY: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleResetAvatarAlignment = () => {
    setProfileForm((prev) => ({
      ...prev,
      avatarScale: 100,
      avatarX: 0,
      avatarY: 0
    }));
  };
  const [newPlatform, setNewPlatform] = useState('LinkedIn');
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('LinkedIn');

  const handlePlatformChange = (platform) => {
    setNewPlatform(platform);
    if (!newLabel || PLATFORM_OPTIONS.some(p => p.value === newLabel || p.label === newLabel)) {
      setNewLabel(platform);
    }
  };

  const handleAddSocial = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newSocial = {
      id: 'soc_' + Date.now(),
      platform: newPlatform,
      url: newUrl.trim(),
      label: newLabel.trim() || newPlatform
    };

    setProfileForm((prev) => ({
      ...prev,
      socials: [...(prev.socials || []), newSocial]
    }));

    // Reset inputs
    setNewUrl('');
    setNewLabel(newPlatform);
  };

  const handleRemoveSocial = (id) => {
    setProfileForm((prev) => ({
      ...prev,
      socials: (prev.socials || []).filter((s) => s.id !== id)
    }));
  };

  const handleMoveSocial = (index, direction) => {
    const list = [...(profileForm.socials || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setProfileForm((prev) => ({
      ...prev,
      socials: list
    }));
  };

  const handleUpdateSocialField = (id, field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      socials: (prev.socials || []).map((s) => (s.id === id ? { ...s, [field]: value } : s))
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    triggerToast();
  };

  return (
    <div className="space-y-8">
      {/* 1. General Profile Info */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
        <h3 className="text-lg font-bold text-white mb-1 font-mono">Profile & Bio Settings</h3>
        <p className="text-xs text-zinc-400 mb-6">Updates are instantly synchronized to all portfolio pages.</p>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name || ''}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Role / Subtitle</label>
              <input
                type="text"
                value={profileForm.role || ''}
                onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Bio Description</label>
            <textarea
              rows={3}
              value={profileForm.bio || ''}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="glass-input w-full px-3.5 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Status Title</label>
              <input
                type="text"
                value={profileForm.status || ''}
                onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Status Subtext</label>
              <input
                type="text"
                value={profileForm.statusSub || ''}
                onChange={(e) => setProfileForm({ ...profileForm, statusSub: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Primary Email</label>
              <input
                type="email"
                value={profileForm.email || ''}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Location</label>
              <input
                type="text"
                value={profileForm.location || ''}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="glass-input w-full px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          {/* Profile Picture & Circle Alignment Studio */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Profile Picture & Circle Alignment Studio
                </label>
                <p className="text-[11px] text-zinc-400">
                  Preview exactly how your avatar appears in the hero orbit circle. Click and drag the circle or use the sliders to zoom and position.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetAvatarAlignment}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-[11px] font-mono transition-all"
                title="Reset Zoom & Alignment to Center"
              >
                <RotateCcw size={12} />
                <span>Reset Center</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 rounded-xl bg-black/40 border border-white/[0.08] items-center">
              {/* Interactive Live Circular Orbit Preview */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="text-[10px] font-mono text-zinc-500 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                  <Move size={11} />
                  <span>Click & Drag to Reposition</span>
                </div>
                
                {/* Visual Orbit Badge Container */}
                <div
                  onMouseDown={handleMouseDown}
                  className={`relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center select-none ${
                    isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105'
                  } transition-transform duration-200`}
                >
                  {/* Outer rotating dashed ring */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-white/70 animate-orbit-spin pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
                  
                  {/* Middle glowing glass ring */}
                  <div className="absolute inset-2.5 rounded-full border border-white/20 bg-zinc-950/60 backdrop-blur-md shadow-2xl pointer-events-none" />
                  
                  {/* Satellite node */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] pointer-events-none" />

                  {/* Internal Circle Clip */}
                  <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden flex items-center justify-center border border-white/20 shadow-[0_0_25px_rgba(0,0,0,0.9)] bg-zinc-950 pointer-events-none">
                    {profileForm.avatar ? (
                      <img
                        src={profileForm.avatar}
                        alt="Preview"
                        style={{
                          transform: `scale(${((profileForm.avatarScale || 100) / 100)}) translate(${profileForm.avatarX || 0}%, ${profileForm.avatarY || 0}%)`,
                          transformOrigin: 'center center'
                        }}
                        className="w-full h-full object-cover transition-transform duration-75 select-none pointer-events-none"
                        draggable={false}
                      />
                    ) : (
                      <span className="text-2xl text-zinc-500 font-mono">✦</span>
                    )}
                    {/* Subtle glass overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-30 pointer-events-none" />
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono text-zinc-400">
                  X: <span className="text-white">{profileForm.avatarX || 0}%</span> | Y: <span className="text-white">{profileForm.avatarY || 0}%</span> | Zoom: <span className="text-white">{profileForm.avatarScale || 100}%</span>
                </div>
              </div>

              {/* Adjustment Sliders & File Upload Controls */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. Zoom / Scale Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <ZoomIn size={13} className="text-zinc-400" />
                      <span>Zoom / Scale:</span>
                    </span>
                    <span className="text-white font-bold">{profileForm.avatarScale || 100}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setProfileForm((prev) => ({ ...prev, avatarScale: Math.max(50, (prev.avatarScale || 100) - 5) }))}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300"
                    >
                      <ZoomOut size={12} />
                    </button>
                    <input
                      type="range"
                      min="50"
                      max="250"
                      step="1"
                      value={profileForm.avatarScale || 100}
                      onChange={(e) => setProfileForm({ ...profileForm, avatarScale: Number(e.target.value) })}
                      className="flex-1 accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setProfileForm((prev) => ({ ...prev, avatarScale: Math.min(250, (prev.avatarScale || 100) + 5) }))}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300"
                    >
                      <ZoomIn size={12} />
                    </button>
                  </div>
                </div>

                {/* 2. Horizontal (X) Offset Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
                    <span>Horizontal Offset (X):</span>
                    <span className="text-white font-bold">{profileForm.avatarX || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    step="1"
                    value={profileForm.avatarX || 0}
                    onChange={(e) => setProfileForm({ ...profileForm, avatarX: Number(e.target.value) })}
                    className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>◀ Left (-60%)</span>
                    <span>Center (0%)</span>
                    <span>Right (+60%) ▶</span>
                  </div>
                </div>

                {/* 3. Vertical (Y) Offset Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
                    <span>Vertical Offset (Y):</span>
                    <span className="text-white font-bold">{profileForm.avatarY || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    step="1"
                    value={profileForm.avatarY || 0}
                    onChange={(e) => setProfileForm({ ...profileForm, avatarY: Number(e.target.value) })}
                    className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>▲ Up (-60%)</span>
                    <span>Center (0%)</span>
                    <span>Down (+60%) ▼</span>
                  </div>
                </div>

                {/* 4. Image URL / File Upload */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2">
                  <input
                    type="text"
                    placeholder="Image URL or upload below..."
                    value={profileForm.avatar || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="glass-input w-full px-3 py-1.5 text-xs"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileForm((prev) => ({ ...prev, avatar: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all"
          >
            <Save size={13} />
            <span>Save Profile Info</span>
          </button>
        </form>
      </div>

      {/* 2. Social Handles & Links Manager */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Link2 size={18} className="text-zinc-400" />
            <span>Social Handles & Action Buttons</span>
          </h3>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-full border border-white/10">
            Hover Reveal Effect Active
          </span>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Add or edit social media handles, email, and Download CV button. These appear as square icons next to "Explore Work" on Home, and in the right corner on all other pages. On mouse hover, they smoothly expand into rectangles revealing their platform name.
        </p>

        {/* Add New Handle Form */}
        <form onSubmit={handleAddSocial} className="p-4 rounded-xl bg-black/40 border border-white/[0.06] mb-6 space-y-4">
          <div className="text-xs font-mono font-semibold text-zinc-300">Add New Social Handle / Link</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Platform Dropdown */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Platform</label>
              <select
                value={newPlatform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs bg-zinc-950 text-white rounded-lg border border-white/10"
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Button Label */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Hover Label</label>
              <input
                type="text"
                placeholder="e.g. LinkedIn, Download CV"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Target URL / Link</label>
              <input
                type="text"
                placeholder={PLATFORM_OPTIONS.find(p => p.value === newPlatform)?.placeholder || 'https://...'}
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="glass-input w-full px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newUrl.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:opacity-50 text-xs font-medium transition-all"
            >
              <Plus size={13} />
              <span>Add Handle</span>
            </button>
          </div>
        </form>

        {/* Existing Social Handles List */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-mono text-zinc-400">Configured Handles ({(profileForm.socials || []).length})</div>
          
          {(profileForm.socials || []).length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-500 font-mono border border-dashed border-white/10 rounded-xl">
              No social handles added yet. Use the form above to add your LinkedIn, GitHub, CV, etc.
            </div>
          ) : (
            (profileForm.socials || []).map((soc, idx) => (
              <div
                key={soc.id || idx}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.06] hover:border-white/15 transition-all"
              >
                {/* Left: Icon & Platform info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
                    {getSocialIcon(soc.platform, 14)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 min-w-0">
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500">Platform</span>
                      <select
                        value={soc.platform}
                        onChange={(e) => handleUpdateSocialField(soc.id, 'platform', e.target.value)}
                        className="glass-input w-full px-2 py-1 text-xs bg-zinc-900 text-white rounded border border-white/10"
                      >
                        {PLATFORM_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500">Hover Label</span>
                      <input
                        type="text"
                        value={soc.label || ''}
                        onChange={(e) => handleUpdateSocialField(soc.id, 'label', e.target.value)}
                        className="glass-input w-full px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-zinc-500">URL / Link</span>
                      <input
                        type="text"
                        value={soc.url || ''}
                        onChange={(e) => handleUpdateSocialField(soc.id, 'url', e.target.value)}
                        className="glass-input w-full px-2 py-1 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview & Reorder / Delete Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Live Hover Button Preview */}
                  <div className="hidden sm:block mr-2" title="Live preview of this expanding button">
                    <SocialHandleButton social={soc} />
                  </div>

                  {/* Move Up */}
                  <button
                    type="button"
                    onClick={() => handleMoveSocial(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 border border-white/5 transition-all"
                    title="Move up"
                  >
                    <ArrowUp size={12} />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    onClick={() => handleMoveSocial(idx, 1)}
                    disabled={idx === (profileForm.socials || []).length - 1}
                    className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white disabled:opacity-30 border border-white/5 transition-all"
                    title="Move down"
                  >
                    <ArrowDown size={12} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(soc.id)}
                    className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-500/20 transition-all"
                    title="Delete handle"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Save Button for All Changes */}
        <button
          onClick={handleSave}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
        >
          <Save size={13} />
          <span>Save Profile & Social Handles</span>
        </button>
      </div>
    </div>
  );
};
