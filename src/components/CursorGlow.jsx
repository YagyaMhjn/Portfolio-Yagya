import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const CursorGlow = () => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';
  const orbRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Only enable cursor glow on non-touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -400;
    let targetY = -400;
    let currentX = -400;
    let currentY = -400;
    let animId;
    let isVisible = false;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        if (orbRef.current) orbRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (orbRef.current) orbRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const updatePosition = () => {
      // Smooth lerp (linear interpolation) with buttery damping
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;

      const transformStr = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (orbRef.current) {
        orbRef.current.style.transform = transformStr;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = transformStr;
      }

      animId = requestAnimationFrame(updatePosition);
    };

    animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Large subtle ambient glow orb (GPU compositor accelerated, zero React re-renders) */}
      <div
        ref={orbRef}
        className="pointer-events-none fixed top-0 left-0 z-30 opacity-0 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full will-change-transform"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.015) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 70%)',
          filter: 'blur(35px)',
          margin: '-170px 0 0 -170px'
        }}
      />
      {/* Crisp small central tracking glint */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-30 opacity-0 transition-opacity duration-200 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full will-change-transform"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(0, 0, 0, 0.15) 0%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 80%)',
          margin: '-16px 0 0 -16px'
        }}
      />
    </>
  );
};