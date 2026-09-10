import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggleButton = ({ className = "" }) => {
  const { theme, toggleTheme } = usePortfolio();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`inline-flex items-center justify-center h-9 min-w-[36px] px-2.5 rounded-xl bg-zinc-900/90 dark:bg-zinc-900/90 border border-white/10 dark:border-white/10 text-zinc-300 dark:text-zinc-300 hover:text-white dark:hover:text-white hover:border-white/30 dark:hover:border-white/30 transition-all duration-300 ease-out group overflow-hidden shadow-md cursor-pointer select-none backdrop-blur-md ${className}`}
    >
      {/* Label expanding smoothly to the left */}
      <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:mr-2 transition-all duration-300 ease-out whitespace-nowrap text-xs font-mono font-medium tracking-wide">
        {isDark ? 'Dark' : 'Light'}
      </span>

      {/* Icon (Anchored on right) */}
      <span className="shrink-0 flex items-center justify-center text-zinc-300 dark:text-zinc-300 group-hover:scale-110 transition-transform duration-300">
        {isDark ? (
          <Moon size={15} className="text-zinc-300 group-hover:text-white transition-colors" />
        ) : (
          <Sun size={15} className="text-amber-400 group-hover:text-amber-500 transition-colors" />
        )}
      </span>
    </button>
  );
};
