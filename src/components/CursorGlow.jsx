import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const CursorGlow = () => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable cursor glow on non-touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;
    let animId;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const updatePosition = () => {
      // Smooth lerp (linear interpolation)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      setPos({ x: Math.round(currentX), y: Math.round(currentY) });
      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Large subtle ambient glow orb (Inverted: dark in light mode, white in dark mode) */}
      <div
        className="pointer-events-none fixed z-30 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          background: isLight
            ? 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.015) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />
      {/* Crisp small central tracking glint (Inverted: dark in light mode, white in dark mode) */}
      <div
        className="pointer-events-none fixed z-30 transition-opacity duration-200 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          background: isLight
            ? 'radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 80%)',
        }}
      />
    </>
  );
};