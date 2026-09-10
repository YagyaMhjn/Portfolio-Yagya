import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, KeyRound, AlertCircle, X, ShieldCheck } from 'lucide-react';

export const AdminAuthModal = () => {
  const { showAdminModal, setShowAdminModal, loginAdmin } = usePortfolio();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAdminModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const result = loginAdmin(password);
      if (!result.success) {
        setError(result.error || 'Access denied. Incorrect security key.');
      } else {
        setPassword('');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl relative">
        <button
          onClick={() => {
            setShowAdminModal(false);
            setError('');
            setPassword('');
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
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
              <AlertCircle size={14} className="shrink-0" />
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
                type="password"
                autoFocus
                required
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-9 pr-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse font-mono text-xs">Authenticating...</span>
            ) : (
              <>
                <ShieldCheck size={15} />
                <span>Verify Access</span>
              </>
            )}
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