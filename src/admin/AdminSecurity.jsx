import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Shield, KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminSecurity = ({ triggerToast }) => {
  const { changePassword } = usePortfolio();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!oldPassword) {
      setStatus({ type: 'error', message: 'Please enter your current password.' });
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setStatus({ type: 'error', message: 'New password must be at least 4 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = changePassword(oldPassword, newPassword, confirmPassword);
      if (res.success) {
        setStatus({
          type: 'success',
          message: res.message || 'Password successfully updated! Your new password is now active.'
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (triggerToast) triggerToast();
      } else {
        setStatus({ type: 'error', message: res.error || 'Failed to change password.' });
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Security & Authentication</h3>
            <p className="text-xs text-zinc-400">
              Update your administrator access passphrase used to unlock this control console.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/[0.08] max-w-xl">
        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
          <KeyRound size={15} className="text-zinc-400" />
          <span>Change Access Passphrase</span>
        </h4>

        {/* Feedback Message */}
        {status.message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 mb-5 ${
              status.type === 'success'
                ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/50 border border-red-500/40 text-red-300'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Current Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showOld ? 'text' : 'password'}
                required
                placeholder="Enter existing password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="glass-input w-full pl-9 pr-10 py-2.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                title={showOld ? 'Hide password' : 'Show password'}
              >
                {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={4}
                placeholder="Enter new password (min. 4 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input w-full pl-9 pr-10 py-2.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                title={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Confirm New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={4}
                placeholder="Re-enter new password to confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`glass-input w-full pl-9 pr-10 py-2.5 text-xs text-white ${
                  confirmPassword && newPassword !== confirmPassword ? 'border-red-500/50' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                title={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <span className="text-[11px] text-red-400 mt-1 block">
                Passwords do not match.
              </span>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || (confirmPassword && newPassword !== confirmPassword)}
              className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Updating Passphrase...</span>
              ) : (
                <>
                  <Shield size={14} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
            ✦ Stored securely in your client enclave. If reset to default, original credentials will be restored.
          </p>
        </div>
      </div>
    </div>
  );
};
