import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/**
 * InteractiveOwl Component
 * - Perched on top of the 'Get in Touch' button
 * - In Dark Mode: Awake, big expressive eyes.
 *   - Idle: looks randomly in different directions with periodic blinking.
 *   - Hover/Proximity (within ~240px circular radius): eyes smoothly track the cursor.
 * - In Light Mode: Sleeps with curved closed eyes and gentle breathing motion.
 *   - Proximity Hover (within ~240px circular radius): stacked 'Z's float up from its head.
 * - Clicking the owl triggers a cute reaction without navigating away.
 */
export const InteractiveOwl = ({ className = '' }) => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';

  const owlRef = useRef(null);
  const [isInsideRadius, setIsInsideRadius] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isChirping, setIsChirping] = useState(false);

  // Smooth pupil position (in SVG coordinates)
  const currentPupil = useRef({ x: 0, y: 0 });
  const targetPupil = useRef({ x: 0, y: 0 });
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  // Detection radius around owl center
  const TRACKING_RADIUS = 240;
  const MAX_PUPIL_OFFSET = 4.8; // Maximum pupil travel distance in SVG units

  // Handle cursor movement around the owl
  const handleMouseMove = useCallback((e) => {
    if (!owlRef.current) return;

    const rect = owlRef.current.getBoundingClientRect();
    const owlCenterX = rect.left + rect.width / 2;
    const owlCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - owlCenterX;
    const dy = e.clientY - owlCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= TRACKING_RADIUS) {
      setIsInsideRadius(true);

      if (!isLight) {
        // Calculate angle and scale offset smoothly based on distance
        const angle = Math.atan2(dy, dx);
        const intensity = Math.min(1, dist / 110);
        const targetX = Math.cos(angle) * MAX_PUPIL_OFFSET * intensity;
        const targetY = Math.sin(angle) * MAX_PUPIL_OFFSET * intensity;
        targetPupil.current = { x: targetX, y: targetY };
      }
    } else {
      setIsInsideRadius(false);
    }
  }, [isLight]);

  // Global mousemove listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Smooth RAF interpolation for eye movement
  useEffect(() => {
    let animId;
    const updatePupil = () => {
      // Lerp for organic, silky smooth eye motion
      currentPupil.current.x += (targetPupil.current.x - currentPupil.current.x) * 0.18;
      currentPupil.current.y += (targetPupil.current.y - currentPupil.current.y) * 0.18;

      setPupilPos({
        x: Number(currentPupil.current.x.toFixed(2)),
        y: Number(currentPupil.current.y.toFixed(2)),
      });

      animId = requestAnimationFrame(updatePupil);
    };

    animId = requestAnimationFrame(updatePupil);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Idle random glances when outside tracking radius in Dark Mode
  useEffect(() => {
    if (isLight || isInsideRadius) return;

    const glanceOptions = [
      { x: 0, y: 0 },         // center
      { x: -3.8, y: -0.5 },    // look left
      { x: 3.8, y: -0.5 },     // look right
      { x: 0, y: -3.2 },       // look up
      { x: 0, y: 3.5 },        // look down at button
      { x: -2.5, y: 2.5 },     // look down-left
      { x: 2.5, y: 2.5 },      // look down-right
      { x: 0, y: 0 },         // center
    ];

    const interval = setInterval(() => {
      if (isInsideRadius) return;
      const randomGlance = glanceOptions[Math.floor(Math.random() * glanceOptions.length)];
      targetPupil.current = randomGlance;
    }, 2800);

    return () => clearInterval(interval);
  }, [isLight, isInsideRadius]);

  // Occasional natural blinking in Dark Mode
  useEffect(() => {
    if (isLight) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4500 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, [isLight]);

  // Owl click reaction: cute flutter/bounce without navigating away
  const handleOwlClick = (e) => {
    e.stopPropagation();
    setIsChirping(true);
    setTimeout(() => setIsChirping(false), 600);
  };

  return (
    <div
      ref={owlRef}
      onClick={handleOwlClick}
      className={`absolute -top-[45px] sm:-top-[48px] right-6 sm:right-8 z-30 w-12 h-13 select-none cursor-pointer transition-transform duration-300 ${
        isChirping ? 'scale-110 -rotate-6' : 'hover:scale-105'
      } ${className}`}
      title={isLight ? 'Sleeping owl... (Hover near me to see dreams)' : 'Observant owl is watching!'}
    >
      {/* Floating Animated 'Zzz' in Light Mode when hovered inside radius */}
      {isLight && isInsideRadius && (
        <div className="absolute -top-8 right-1 pointer-events-none flex flex-col items-center z-40">
          <span
            className="absolute font-mono font-extrabold text-xs text-zinc-600 dark:text-zinc-400 select-none animate-owl-z1"
            style={{ animationDuration: '2.2s', animationIterationCount: 'infinite' }}
          >
            z
          </span>
          <span
            className="absolute font-mono font-black text-sm text-zinc-700 dark:text-zinc-300 select-none animate-owl-z2"
            style={{ animationDuration: '2.2s', animationIterationCount: 'infinite', animationDelay: '0.65s' }}
          >
            Z
          </span>
          <span
            className="absolute font-mono font-black text-base text-zinc-800 dark:text-zinc-200 select-none animate-owl-z3"
            style={{ animationDuration: '2.2s', animationIterationCount: 'infinite', animationDelay: '1.3s' }}
          >
            Z
          </span>
        </div>
      )}

      {/* Main Vector SVG Owl */}
      <svg
        viewBox="0 0 100 105"
        className={`w-full h-full overflow-visible drop-shadow-md ${
          isLight ? 'animate-owl-breathe' : ''
        }`}
      >
        <defs>
          {/* Gradients for Body & Feathers */}
          <linearGradient id="owlBodyDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2b34" />
            <stop offset="60%" stopColor="#1e1f26" />
            <stop offset="100%" stopColor="#141419" />
          </linearGradient>
          <linearGradient id="owlMaskDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#40424f" />
            <stop offset="100%" stopColor="#2d2e38" />
          </linearGradient>

          <linearGradient id="owlBodyLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="60%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="owlMaskLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <linearGradient id="owlBeak" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* 1. Pointed Ear Tufts & Main Chubby Body Silhouette */}
        <path
          d="M 18 20 
             L 27 30 
             Q 50 25 73 30 
             L 82 20 
             Q 77 38 85 54 
             Q 90 72 84 89 
             Q 75 97 50 97 
             Q 25 97 16 89 
             Q 10 72 15 54 
             Q 23 38 18 20 Z"
          fill={isLight ? 'url(#owlBodyLight)' : 'url(#owlBodyDark)'}
          stroke={isLight ? '#334155' : '#474959'}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 2. Side Wings Silhouette */}
        <path
          d="M 16 56 Q 26 68 24 85 Q 15 84 15 65 Z"
          fill={isLight ? '#3b4759' : '#17181f'}
          opacity="0.75"
        />
        <path
          d="M 84 56 Q 74 68 76 85 Q 85 84 85 65 Z"
          fill={isLight ? '#3b4759' : '#17181f'}
          opacity="0.75"
        />

        {/* 3. Facial Contour / Mask (Heart-Eyed Contour) */}
        <path
          d="M 50 36 
             C 41 29 24 30 23 48 
             C 22 62 36 71 50 71 
             C 64 71 78 62 77 48 
             C 76 30 59 29 50 36 Z"
          fill={isLight ? 'url(#owlMaskLight)' : 'url(#owlMaskDark)'}
          stroke={isLight ? '#475569' : '#57596a'}
          strokeWidth="1.4"
        />

        {/* 4. Brow Lines */}
        <path
          d="M 27 37 Q 36 34 45 39"
          fill="none"
          stroke={isLight ? '#334155' : '#1c1d24'}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 73 37 Q 64 34 55 39"
          fill="none"
          stroke={isLight ? '#334155' : '#1c1d24'}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* 5. Eyes System (Awake Sclera & Pupils vs Closed Sleeping Eyelids) */}
        {isLight || isBlinking ? (
          /* Sleeping / Blinking Eyes (Curved peaceful lashes) */
          <g className="transition-opacity duration-300 ease-in-out">
            {/* Left Eye Eyelid Slit */}
            <path
              d="M 25 50 Q 36 57 46 50"
              fill="none"
              stroke={isLight ? '#1e293b' : '#0f1015'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Right Eye Eyelid Slit */}
            <path
              d="M 54 50 Q 64 57 75 50"
              fill="none"
              stroke={isLight ? '#1e293b' : '#0f1015'}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        ) : (
          /* Awake Open Eyes with Specular Highlight and Tracking Pupil */
          <g className="transition-opacity duration-300 ease-in-out">
            {/* Left Sclera (White Eye Socket) */}
            <circle cx="35" cy="49" r="12.5" fill="#ffffff" stroke="#1c1d24" strokeWidth="1" />
            {/* Right Sclera */}
            <circle cx="65" cy="49" r="12.5" fill="#ffffff" stroke="#1c1d24" strokeWidth="1" />

            {/* Left Pupil + Specular Reflection */}
            <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
              <circle cx="35" cy="49" r="6.4" fill="#09090b" />
              {/* Primary Glare Catchlight */}
              <circle cx="33" cy="46.8" r="2.2" fill="#ffffff" />
              {/* Secondary Subtle Glare */}
              <circle cx="37.2" cy="51.5" r="1" fill="#ffffff" opacity="0.7" />
            </g>

            {/* Right Pupil + Specular Reflection */}
            <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
              <circle cx="65" cy="49" r="6.4" fill="#09090b" />
              {/* Primary Glare Catchlight */}
              <circle cx="63" cy="46.8" r="2.2" fill="#ffffff" />
              {/* Secondary Subtle Glare */}
              <circle cx="67.2" cy="51.5" r="1" fill="#ffffff" opacity="0.7" />
            </g>
          </g>
        )}

        {/* 6. Beak */}
        <polygon
          points="50,56 44,65 50,71 56,65"
          fill="url(#owlBeak)"
          stroke="#b45309"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 7. Cute Chin/Beard Contour */}
        <path
          d="M 42 70 Q 50 76 58 70"
          fill="none"
          stroke={isLight ? '#64748b' : '#3c3e4c'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 8. Paws / Claws (Overlap button top edge) */}
        {/* Left Foot: 3 rounded little claw pads */}
        <g fill="#fbbf24" stroke="#b45309" strokeWidth="0.8">
          <ellipse cx="31" cy="98" rx="3" ry="4.5" />
          <ellipse cx="36" cy="99" rx="3" ry="5" />
          <ellipse cx="41" cy="98" rx="3" ry="4.5" />
        </g>
        {/* Right Foot: 3 rounded little claw pads */}
        <g fill="#fbbf24" stroke="#b45309" strokeWidth="0.8">
          <ellipse cx="59" cy="98" rx="3" ry="4.5" />
          <ellipse cx="64" cy="99" rx="3" ry="5" />
          <ellipse cx="69" cy="98" rx="3" ry="4.5" />
        </g>
      </svg>
    </div>
  );
};
