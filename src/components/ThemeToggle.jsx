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
      className={`theme-toggle-btn inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ease-out shadow-md hover:scale-105 cursor-pointer select-none backdrop-blur-md ${
        isDark
          ? 'bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30'
          : 'bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:border-zinc-400 shadow-sm'
      } ${className}`}
    >
      <span className="shrink-0 flex items-center justify-center transition-transform duration-300 hover:rotate-12">
        {isDark ? (
          <Moon size={16} className="text-zinc-300 hover:text-white transition-colors" />
        ) : (
          <Sun size={16} className="text-amber-500 hover:text-amber-600 transition-colors" />
        )}
      </span>
    </button>
  );
};
