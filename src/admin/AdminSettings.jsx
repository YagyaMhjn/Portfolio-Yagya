import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sliders, Activity, Check, X } from 'lucide-react';

export const AdminSettings = ({ triggerToast }) => {
  const { enableLoader, toggleLoaderEnabled } = usePortfolio();

  const handleToggle = () => {
    toggleLoaderEnabled();
    if (triggerToast) triggerToast();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">System & Display Settings</h3>
            <p className="text-xs text-zinc-400">
              Configure system features, presentation options, and interactive transition behaviors.
            </p>
          </div>
        </div>
      </div>

      {/* Setting 1: Section Transition Loading Screen */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0c0f] border border-white/[0.08] max-w-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-zinc-300" />
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Section Transition Loading Screens
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Displays dynamic data visualization loading screens (Bar Graphs, Growth Curves, Cluster Matrix, and Radial Radar) with motivational transmissions during section navigation.
            </p>
          </div>

          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            type="button"
            role="switch"
            aria-checked={enableLoader}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/20 ${
              enableLoader ? 'bg-emerald-600' : 'bg-zinc-800'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out flex items-center justify-center text-[10px] ${
                enableLoader ? 'translate-x-7 text-emerald-700' : 'translate-x-0 text-zinc-600'
              }`}
            >
              {enableLoader ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
            </span>
          </button>
        </div>

        {/* Status Box */}
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            enableLoader
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-zinc-900/60 border-white/10 text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${enableLoader ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            <span className="font-mono font-semibold">
              {enableLoader ? 'Loading Screens: ENABLED' : 'Loading Screens: DISABLED'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            {enableLoader ? 'Active on section switches' : 'Instant section switches'}
          </span>
        </div>

        {/* Behavioral Rule Breakdown */}
        <div className="pt-2 border-t border-white/[0.06] space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            Operational Rules:
          </div>
          <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside font-light">
            <li>
              <strong className="text-zinc-200">First-Visit Skip:</strong> Never shows a loader when entering the site for the first time.
            </li>
            <li>
              <strong className="text-zinc-200">2-Second Threshold:</strong> If a user switches to another page under 2 seconds of the current page being loaded, no loader appears (instant transition).
            </li>
            <li>
              <strong className="text-zinc-200">Mid-Load Re-routing:</strong> If a user clicks a new page while loading is in progress, the loader resets on the spot for the new page without showing intermediate screens.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
