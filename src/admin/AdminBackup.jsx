import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Download, RefreshCw, Upload } from 'lucide-react';

export const AdminBackup = () => {
  const { exportData, importData, resetToDefault } = usePortfolio();
  const [jsonInput, setJsonInput] = useState('');
  const [backupMsg, setBackupMsg] = useState('');

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08] space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1 font-mono">Database & Backup Engine</h3>
        <p className="text-xs text-zinc-400">Export complete JSON state or restore from backup.</p>
      </div>

      {backupMsg && (
        <div className="p-3 rounded-xl bg-zinc-900 border border-white/20 text-xs font-mono text-white">
          {backupMsg}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            const json = exportData();
            navigator.clipboard.writeText(json);
            setBackupMsg('Complete portfolio JSON copied to clipboard!');
            setTimeout(() => setBackupMsg(''), 3000);
          }}
          className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
        >
          <Download size={13} /> <span>Copy JSON Backup</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Reset all portfolio data to default seed?')) {
              resetToDefault();
              setBackupMsg('Reset to default seed portfolio data.');
              setTimeout(() => setBackupMsg(''), 3000);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-medium text-xs hover:bg-red-900/50 transition-all flex items-center gap-1.5"
        >
          <RefreshCw size={13} /> <span>Reset to Default</span>
        </button>
      </div>

      <div className="pt-4 border-t border-white/[0.06]">
        <label className="block text-xs font-mono text-zinc-400 mb-2">
          Restore from JSON string
        </label>
        <textarea
          rows={6}
          placeholder="Paste exported JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="glass-input w-full p-3 text-xs font-mono"
        />
        <button
          onClick={() => {
            if (!jsonInput.trim()) return;
            const res = importData(jsonInput);
            if (res.success) {
              setBackupMsg('Data successfully imported and applied!');
              setJsonInput('');
            } else {
              setBackupMsg(res.error || 'Failed to import JSON.');
            }
            setTimeout(() => setBackupMsg(''), 3000);
          }}
          className="mt-3 px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-medium text-xs hover:bg-zinc-800 transition-all flex items-center gap-1.5"
        >
          <Upload size={13} /> <span>Apply JSON State</span>
        </button>
      </div>
    </div>
  );
};
