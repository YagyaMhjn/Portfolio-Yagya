import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, KeyRound, AlertCircle, X, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const AdminAuthModal = () => {
  const { showAdminModal, setShowAdminModal, loginAdmin } = usePortfolio();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!showAdminModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    const result = loginAdmin(password);
    if (result.success) {
      setPassword('');
      setError('');
      setShowAdminModal(false);
    } else {
      setError(result.error || 'Access denied. Incorrect security passphrase.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl relative">
        <button
          onClick={() => {
            setShowAdminModal(false);
            setError('');
            setPassword('');
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          title="Close modal"
        >
          <X size={15} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-3 text-white">
            <Lock size={20} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Security Access Control</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Authenticate with administrator passphrase to modify portfolio data.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Passphrase
            </label>
            <div className="relative">
              <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-9 pr-10 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-glow w-full py-2.5 px-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={15} />
            <span>Verify Access</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <span className="text-[10px] font-mono text-zinc-600">
            SECURE ACCESS ENCLAVE • LOCALSTORAGE SYNC
          </span>
        </div>
      </div>
    </div>
  );
};