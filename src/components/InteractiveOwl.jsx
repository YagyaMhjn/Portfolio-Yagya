import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/**
 * InteractiveOwl Component (Mid-Century Modern Geometric Style)
 * - Silhouette based on iconic Bauhaus/Charley Harper geometric owl artwork:
 *   - Triangular ear tufts, rounded head arches, straight body sides.
 *   - Forehead circular emblem.
 *   - Big concentric geometric eyes with live pupil tracking in Dark Mode.
 *   - Downward triangular beak and split dual-triangle chest/belly diamond.
 *   - Segmented color-blocked geometric wings.
 *   - Three-toed geometric claws firmly perched on the button top edge.
 * - In Dark Mode: Awake in crisp slate, silver, and graphite with amber iris & tracking pupils.
 * - In Light Mode: Sleeps in rich warm dark brown / chocolate tones with closed geometric eyelids
 *   and progressive floating 'Zzz' particles (33%, 66%, 99%).
 * - Non-navigating click interaction.
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

  // Floating 'Z' particle system
  const [zParticles, setZParticles] = useState([]);
  const zCycleRef = useRef(0);
  const Z_SCALES = [0.33, 0.66, 0.99];

  // Detection radius around owl center
  const TRACKING_RADIUS = 195;
  const MAX_PUPIL_OFFSET = 4.2; // Maximum pupil travel distance inside geometric eye

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
        const intensity = Math.min(1, dist / 95);
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
      { x: -3.5, y: -0.5 },    // look left
      { x: 3.5, y: -0.5 },     // look right
      { x: 0, y: -3.0 },       // look up
      { x: 0, y: 3.2 },        // look down at button
      { x: -2.4, y: 2.2 },     // look down-left
      { x: 2.4, y: 2.2 },      // look down-right
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

  // Clear Z particles immediately if switching to Dark Mode (awake)
  useEffect(() => {
    if (!isLight) {
      setZParticles([]);
    }
  }, [isLight]);

  // Floating 'Z' Spawner in Light Mode
  // - 0.25s entry delay before first spawn
  // - Cycles through 33%, 66%, 99%
  // - When cursor leaves radius, stops producing new ones, but existing particles finish their full trajectory and fade out
  useEffect(() => {
    if (!isLight || !isInsideRadius) return;

    let spawnInterval = null;

    // 0.25s (250ms) entry delay
    const entryTimeout = setTimeout(() => {
      const spawnZ = () => {
        const scale = Z_SCALES[zCycleRef.current % 3];
        zCycleRef.current += 1;
        const particleId = Date.now() + Math.random();

        setZParticles((prev) => [...prev, { id: particleId, scale }]);

        // Particle finishes trajectory in 2.0s and self-cleans
        setTimeout(() => {
          setZParticles((prev) => prev.filter((p) => p.id !== particleId));
        }, 2050);
      };

      // Spawn initial Z after entry delay
      spawnZ();

      // Continue producing Z's in rhythm while inside radius
      spawnInterval = setInterval(spawnZ, 720);
    }, 250);

    return () => {
      clearTimeout(entryTimeout);
      if (spawnInterval) clearInterval(spawnInterval);
    };
  }, [isLight, isInsideRadius]);

  // Owl click reaction: cute tilt reaction without navigating away or resizing
  const handleOwlClick = (e) => {
    e.stopPropagation();
    setIsChirping(true);
    setTimeout(() => setIsChirping(false), 500);
  };

  return (
    <div
      ref={owlRef}
      onClick={handleOwlClick}
      /* Firmly perched on top of button with claws overlapping border, enlarged size, NO hover scale */
      className={`absolute bottom-[calc(100%-8px)] sm:bottom-[calc(100%-10px)] right-5 sm:right-7 z-30 w-[68px] h-[76px] sm:w-[84px] sm:h-[94px] select-none cursor-pointer transition-transform duration-300 ${
        isChirping ? '-rotate-6' : ''
      } ${className}`}
      title={isLight ? 'Sleeping geometric owl... (Hover near me to see dreams)' : 'Observant geometric owl is watching!'}
    >
      {/* Floating Animated 'Z' Particles in Light Mode */}
      {isLight && zParticles.length > 0 && (
        <div className="absolute -top-4 right-1 pointer-events-none z-40 w-16 h-16 overflow-visible">
          {zParticles.map((p) => (
            <span
              key={p.id}
              className="absolute pointer-events-none font-mono font-black select-none text-amber-950 animate-owl-z-particle"
              style={{
                '--z-scale': p.scale,
                top: '0px',
                right: '4px',
                fontSize: '28px',
                lineHeight: 1,
                animationDuration: '2.0s',
                animationFillMode: 'forwards',
                animationTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              Z
            </span>
          ))}
        </div>
      )}

      {/* Main Vector SVG Owl (Mid-Century Geometric Design) */}
      <svg
        viewBox="0 0 100 120"
        className={`w-full h-full overflow-visible drop-shadow-lg ${
          isLight ? 'animate-owl-breathe' : ''
        }`}
      >
        {/* ===============================================================
            1. MAIN GEOMETRIC SILHOUETTE (Body + Head + Triangular Ears)
           =============================================================== */}
        <path
          d="M 9 8 
             L 91 8 
             L 78 22 
             C 88 32 89 44 89 60 
             L 89 104 
             L 11 104 
             L 11 60 
             C 11 44 12 32 22 22 
             Z"
          fill={isLight ? '#3e2015' : '#141418'}
          stroke={isLight ? '#2a150e' : '#333544'}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* ===============================================================
            2. FOREHEAD CIRCLE
           =============================================================== */}
        <circle
          cx="50"
          cy="16"
          r="7"
          fill={isLight ? '#c25e37' : '#94a3b8'}
        />

        {/* ===============================================================
            3. GEOMETRIC WINGS (Left & Right Flanks)
           =============================================================== */}
        {/* Left Wing Upper Crescent */}
        <path
          d="M 11 54 C 23 54 32 66 32 84 L 11 84 Z"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Left Wing Upper Inner Quadrant */}
        <rect
          x="11"
          y="68"
          width="10"
          height="16"
          fill={isLight ? '#785928' : '#334155'}
        />
        {/* Left Wing Lower Triangle */}
        <polygon
          points="11,84 32,84 11,104"
          fill={isLight ? '#d97706' : '#64748b'}
        />

        {/* Right Wing Upper Crescent */}
        <path
          d="M 89 54 C 77 54 68 66 68 84 L 89 84 Z"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Right Wing Upper Inner Quadrant */}
        <rect
          x="79"
          y="68"
          width="10"
          height="16"
          fill={isLight ? '#785928' : '#334155'}
        />
        {/* Right Wing Lower Triangle */}
        <polygon
          points="89,84 68,84 89,104"
          fill={isLight ? '#d97706' : '#64748b'}
        />

        {/* ===============================================================
            4. CHEST / BELLY SPLIT DIAMOND MOSAIC
           =============================================================== */}
        {/* Upper Inverted Triangle (White/Cream & Tan split) */}
        {/* Left Half (Crisp White/Cream) */}
        <polygon
          points="50,56 32,84 50,84"
          fill={isLight ? '#fef3c7' : '#f1f5f9'}
        />
        {/* Right Half (Peach/Tan / Silver) */}
        <polygon
          points="50,56 68,84 50,84"
          fill={isLight ? '#fcd34d' : '#cbd5e1'}
        />

        {/* Lower Triangle (Terracotta & Ochre / Slate split) */}
        {/* Left Half */}
        <polygon
          points="32,84 50,84 50,104"
          fill={isLight ? '#c25e37' : '#64748b'}
        />
        {/* Right Half */}
        <polygon
          points="68,84 50,84 50,104"
          fill={isLight ? '#b45309' : '#475569'}
        />

        {/* ===============================================================
            5. EYES SYSTEM (Concentric Circles & Live Tracking / Sleeping)
           =============================================================== */}
        {/* Outer White Sclera Rings */}
        <circle cx="32" cy="38" r="15.5" fill="#ffffff" stroke={isLight ? '#3e2015' : '#1e293b'} strokeWidth="1" />
        <circle cx="68" cy="38" r="15.5" fill="#ffffff" stroke={isLight ? '#3e2015' : '#1e293b'} strokeWidth="1" />

        {isLight || isBlinking ? (
          /* Sleeping / Blinking State: Sleek Bauhaus Closed Eyelids */
          <g className="transition-opacity duration-300 ease-in-out">
            {/* Left Closed Eye Slit */}
            <line
              x1="20"
              y1="38"
              x2="44"
              y2="38"
              stroke={isLight ? '#26120b' : '#0f172a'}
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Left Eyelid Curved Fold */}
            <path
              d="M 22 35 Q 32 30 42 35"
              fill="none"
              stroke={isLight ? '#784533' : '#94a3b8'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Right Closed Eye Slit */}
            <line
              x1="56"
              y1="38"
              x2="80"
              y2="38"
              stroke={isLight ? '#26120b' : '#0f172a'}
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Right Eyelid Curved Fold */}
            <path
              d="M 58 35 Q 68 30 78 35"
              fill="none"
              stroke={isLight ? '#784533' : '#94a3b8'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        ) : (
          /* Awake State: Concentric Amber Iris & Black Pupil with Live Glare Tracking */
          <g className="transition-opacity duration-300 ease-in-out">
            {/* Inner Amber Iris Rings */}
            <circle cx="32" cy="38" r="10.5" fill="#f59e0b" />
            <circle cx="68" cy="38" r="10.5" fill="#f59e0b" />

            {/* Left Pupil + Specular Catchlight */}
            <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
              <circle cx="32" cy="38" r="6.2" fill="#09090b" />
              <circle cx="30.2" cy="36" r="2.1" fill="#ffffff" />
            </g>

            {/* Right Pupil + Specular Catchlight */}
            <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
              <circle cx="68" cy="38" r="6.2" fill="#09090b" />
              <circle cx="66.2" cy="36" r="2.1" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* ===============================================================
            6. SHARP GEOMETRIC BEAK
           =============================================================== */}
        <polygon
          points="50,38 45,46 50,56 55,46"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* ===============================================================
            7. GEOMETRIC PERCH BAR & THREE-TOED CLAWS
           =============================================================== */}
        {/* Horizontal Perch Crossbar (as in artwork) */}
        <rect
          x="14"
          y="108"
          width="72"
          height="5.5"
          rx="2"
          fill={isLight ? '#785928' : '#3f4553'}
        />

        {/* Tail Tip (under perch bar) */}
        <polygon
          points="46,113 54,113 50,121"
          fill={isLight ? '#2a150e' : '#1e293b'}
        />

        {/* Left Geometric Claw (3 rounded toes firmly clasping the button) */}
        <g fill="#fbbf24" stroke="#b45309" strokeWidth="0.8">
          {/* Main Foot Pad */}
          <rect x="29" y="104" width="14" height="6" rx="2" />
          {/* 3 Toes extending over perch/button */}
          <rect x="29" y="109" width="3.8" height="8" rx="1.6" />
          <rect x="34.1" y="109" width="3.8" height="8.8" rx="1.6" />
          <rect x="39.2" y="109" width="3.8" height="8" rx="1.6" />
        </g>

        {/* Right Geometric Claw (3 rounded toes firmly clasping the button) */}
        <g fill="#fbbf24" stroke="#b45309" strokeWidth="0.8">
          {/* Main Foot Pad */}
          <rect x="57" y="104" width="14" height="6" rx="2" />
          {/* 3 Toes extending over perch/button */}
          <rect x="57" y="109" width="3.8" height="8" rx="1.6" />
          <rect x="62.1" y="109" width="3.8" height="8.8" rx="1.6" />
          <rect x="67.2" y="109" width="3.8" height="8" rx="1.6" />
        </g>
      </svg>
    </div>
  );
};
