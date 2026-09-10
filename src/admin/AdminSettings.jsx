import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sliders, Activity, Check, X, Moon, Sun, Palette } from 'lucide-react';

export const AdminSettings = ({ triggerToast }) => {
  const { enableLoader, toggleLoaderEnabled, defaultTheme, updateDefaultTheme } = usePortfolio();

  const handleToggleLoader = () => {
    toggleLoaderEnabled();
    if (triggerToast) triggerToast();
  };

  const handleDefaultThemeChange = (newTheme) => {
    if (newTheme === defaultTheme) return;
    updateDefaultTheme(newTheme);
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
              Configure system features, presentation appearance, and interactive transition behaviors.
            </p>
          </div>
        </div>
      </div>

      {/* Setting 1: Default Portfolio Theme (Dark Mode fixed as default, customizable) */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0c0f] border border-white/[0.08] max-w-2xl space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-zinc-300" />
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Default Portfolio Theme
            </h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Controls the initial presentation mode rendered for new visitors entering the portfolio. Dark Mode is fixed as the default standard.
          </p>
        </div>

        {/* Theme Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option: Dark Mode (Default) */}
          <button
            type="button"
            onClick={() => handleDefaultThemeChange('dark')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              defaultTheme === 'dark'
                ? 'bg-zinc-900/90 border-white/40 ring-2 ring-white/20 shadow-lg shadow-black/40'
                : 'bg-zinc-950/40 border-white/10 hover:border-white/25 hover:bg-zinc-900/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-white/15 flex items-center justify-center text-zinc-200">
                <Moon size={15} />
              </div>
              {defaultTheme === 'dark' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={10} strokeWidth={3} /> ACTIVE DEFAULT
                </span>
              )}
            </div>
            <div>
              <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-1">
                Dark Mode (Default)
              </h5>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Deep obsidian black (#070707) with luminous neon accents, moving organic grid, and frosted dark glass.
              </p>
            </div>
          </button>

          {/* Option: Light Mode */}
          <button
            type="button"
            onClick={() => handleDefaultThemeChange('light')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              defaultTheme === 'light'
                ? 'bg-zinc-900/90 border-amber-400/50 ring-2 ring-amber-400/20 shadow-lg shadow-black/40'
                : 'bg-zinc-950/40 border-white/10 hover:border-white/25 hover:bg-zinc-900/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-black/15 flex items-center justify-center text-zinc-900">
                <Sun size={15} className="text-amber-500" />
              </div>
              {defaultTheme === 'light' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                  <Check size={10} strokeWidth={3} /> ACTIVE DEFAULT
                </span>
              )}
            </div>
            <div>
              <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wider mb-1">
                Light Mode
              </h5>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Pure frosted ceramic white (#f8f9fa) with high-contrast text, tactile shadows, and crisp obsidian borders.
              </p>
            </div>
          </button>
        </div>

        {/* Current Default Status Badge */}
        <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.08] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-zinc-300 text-[11px]">
              System Standard: <strong className="text-white uppercase">{defaultTheme} MODE</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Applies to all first-time visitors
          </span>
        </div>
      </div>

      {/* Setting 2: Section Transition Loading Screen */}
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
            onClick={handleToggleLoader}
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
