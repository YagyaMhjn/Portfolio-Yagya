import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const ThemeTransitionCurtain = () => {
  const { themeTransitioning, transitionTarget } = usePortfolio();

  if (!themeTransitioning) return null;

  const isGoingLight = transitionTarget === 'light';

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden" aria-hidden="true">
      <div
        className={`theme-slant-curtain ${
          isGoingLight ? 'curtain-to-light' : 'curtain-to-dark'
        }`}
      />
    </div>
  );
};
