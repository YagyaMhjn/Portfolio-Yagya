import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/**
 * InteractiveOwl Component
 * - Exact vector reproduction of reference image (media_1789250478378.png):
 *   - Curved ear horns with dipped head line.
 *   - Forehead downward-pointing nested chevron crown.
 *   - Big concentric eyes with live pupil tracking in Dark Mode (100px radius).
 *   - Sharp downward orange beak.
 *   - Chest geometric 'X' division with cream side triangles.
 *   - Lower belly nested downward chevron pyramid.
 *   - Rounded teardrop wings with multi-layered scalloped feather scales and crescent inner borders.
 *   - Two 3-toed golden claws firmly attached and fixed directly on the button ledge (no grey bar).
 * - Sleeping motion: Chest breathes subtly while paws remain 100% fixed to the button.
 * - Light Mode 'Zzz': Small uniform size (no size increment) emerging in a single wavy line to the right.
 * - In Dark Mode: Slate, silver, and graphite with amber accents & live tracking pupils within 100px.
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

  // Floating 'Z' particle system (small uniform size, single wavy line)
  const [zParticles, setZParticles] = useState([]);

  // Detection radius around owl center (reduced to 100px as requested)
  const TRACKING_RADIUS = 100;
  const MAX_PUPIL_OFFSET = 3.6; // Pupil travel distance inside eye

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
        const angle = Math.atan2(dy, dx);
        const intensity = Math.min(1, dist / 65);
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
      { x: 0, y: 0 },
      { x: -3.0, y: -0.5 },
      { x: 3.0, y: -0.5 },
      { x: 0, y: -2.6 },
      { x: 0, y: 2.8 },
      { x: -2.0, y: 1.8 },
      { x: 2.0, y: 1.8 },
      { x: 0, y: 0 },
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

  // Clear Z particles if switching to Dark Mode
  useEffect(() => {
    if (!isLight) {
      setZParticles([]);
    }
  }, [isLight]);

  // Floating 'Z' Spawner in Light Mode
  // - 0.25s entry delay
  // - Uniform small size (no size increment)
  // - Comes out in a single wavy horizontal line to the right (never reaches bio)
  // - On cursor exit, new production stops, but existing particles complete their path naturally
  useEffect(() => {
    if (!isLight || !isInsideRadius) return;

    let spawnInterval = null;

    const entryTimeout = setTimeout(() => {
      const spawnZ = () => {
        const particleId = Date.now() + Math.random();

        setZParticles((prev) => [...prev, { id: particleId }]);

        setTimeout(() => {
          setZParticles((prev) => prev.filter((p) => p.id !== particleId));
        }, 2050);
      };

      spawnZ();
      spawnInterval = setInterval(spawnZ, 680);
    }, 250);

    return () => {
      clearTimeout(entryTimeout);
      if (spawnInterval) clearInterval(spawnInterval);
    };
  }, [isLight, isInsideRadius]);

  // Owl click reaction: cute tilt reaction without navigating away
  const handleOwlClick = (e) => {
    e.stopPropagation();
    setIsChirping(true);
    setTimeout(() => setIsChirping(false), 500);
  };

  return (
    <div
      ref={owlRef}
      onClick={handleOwlClick}
      /* Positioned firmly perched on top of button with claws overlapping border, NO hover scale */
      className={`absolute bottom-[calc(100%-8px)] sm:bottom-[calc(100%-10px)] right-5 sm:right-7 z-30 w-[70px] h-[82px] sm:w-[86px] sm:h-[100px] select-none cursor-pointer transition-transform duration-300 ${
        isChirping ? '-rotate-6' : ''
      } ${className}`}
      title={isLight ? 'Sleeping owl... (Hover near me to see dreams)' : 'Observant owl is watching!'}
    >
      {/* Floating Animated 'Z' in a Single Wavy Line (Matching User Drawn S-Path) */}
      {isLight && zParticles.length > 0 && (
        <div className="absolute top-6 sm:top-7 -right-1 pointer-events-none z-40 overflow-visible">
          {zParticles.map((p) => (
            <span
              key={p.id}
              className="absolute pointer-events-none font-mono font-bold select-none text-amber-950 text-[11px] animate-owl-z-wavy"
              style={{
                top: '0px',
                left: '0px',
                lineHeight: 1,
                animationDuration: '2.1s',
                animationFillMode: 'forwards',
                animationTimingFunction: 'cubic-bezier(0.36, 0, 0.66, 1)',
              }}
            >
              z
            </span>
          ))}
        </div>
      )}

      {/* Main Vector SVG Owl (No outer animation so claws stay 100% fixed to button) */}
      <svg
        viewBox="0 0 100 106"
        className="w-full h-full overflow-visible drop-shadow-lg"
      >
        {/* ===============================================================
            UPPER BODY GROUP (Gently breathes from fixed base at y=96)
           =============================================================== */}
        <g className={isLight ? 'animate-owl-chest-breathe' : ''}>
          {/* 1. Head & Body Silhouette */}
          <path
            d="M 9 4 
               C 24 13 36 16 50 16 
               C 64 16 76 13 91 4 
               C 82 17 87 28 88 44 
               C 94 56 94 76 86 96 
               L 14 96 
               C 6 76 6 56 12 44 
               C 13 28 18 17 9 4 Z"
            fill={isLight ? '#3e2015' : '#141418'}
            stroke={isLight ? '#2a150e' : '#272936'}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* 2. Forehead Nested Chevron Crown */}
          <polygon
            points="14,9 50,31 86,9 80,6 50,26 20,6"
            fill={isLight ? '#a82d4a' : '#475569'}
          />
          <polygon
            points="20,6 50,26 80,6 74,4 50,21 26,4"
            fill={isLight ? '#2a8f8d' : '#64748b'}
          />
          <polygon
            points="26,4 50,21 74,4 68,2 50,16 32,2"
            fill={isLight ? '#e05a36' : '#94a3b8'}
          />
          <polygon
            points="32,2 50,16 68,2"
            fill={isLight ? '#e89b27' : '#cbd5e1'}
          />

          {/* 3. Eyes: White Concentric Rings & Pupils */}
          <circle cx="32" cy="33" r="15" fill="#ffffff" stroke={isLight ? '#3e2015' : '#1e293b'} strokeWidth="1" />
          <circle cx="68" cy="33" r="15" fill="#ffffff" stroke={isLight ? '#3e2015' : '#1e293b'} strokeWidth="1" />

          {isLight || isBlinking ? (
            /* Sleeping / Blinking Closed Eyelids */
            <g className="transition-opacity duration-300 ease-in-out">
              <line x1="20" y1="33" x2="44" y2="33" stroke={isLight ? '#26120b' : '#0f172a'} strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 22 29 Q 32 25 42 29" fill="none" stroke={isLight ? '#784533' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round" />

              <line x1="56" y1="33" x2="80" y2="33" stroke={isLight ? '#26120b' : '#0f172a'} strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 58 29 Q 68 25 78 29" fill="none" stroke={isLight ? '#784533' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ) : (
            /* Awake Amber Iris & Tracking Pupils */
            <g className="transition-opacity duration-300 ease-in-out">
              <circle cx="32" cy="33" r="10" fill="#f59e0b" />
              <circle cx="68" cy="33" r="10" fill="#f59e0b" />

              {/* Left Pupil */}
              <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
                <circle cx="32" cy="33" r="5.8" fill="#09090b" />
                <circle cx="30.2" cy="31" r="2" fill="#ffffff" />
              </g>

              {/* Right Pupil */}
              <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
                <circle cx="68" cy="33" r="5.8" fill="#09090b" />
                <circle cx="66.2" cy="31" r="2" fill="#ffffff" />
              </g>
            </g>
          )}

          {/* 4. Triangular Orange Beak */}
          <polygon
            points="44,35 56,35 50,52"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* 5. Chest 'X' Panels (Cream/Ivory & Dark Center) */}
          <polygon
            points="25,48 50,65 25,78"
            fill={isLight ? '#fef3c7' : '#e2e8f0'}
          />
          <polygon
            points="75,48 50,65 75,78"
            fill={isLight ? '#fde68a' : '#cbd5e1'}
          />
          <polygon
            points="25,48 50,52 75,48 50,65"
            fill={isLight ? '#321910' : '#1a1b22'}
          />
          <polygon
            points="35,49 50,52 50,65"
            fill={isLight ? '#26120b' : '#0f1015'}
            opacity="0.45"
          />

          {/* 6. Lower Belly Nested Chevron Pyramid */}
          <polygon
            points="25,78 50,65 75,78 70,82 50,71 30,82"
            fill={isLight ? '#e05a36' : '#f59e0b'}
          />
          <polygon
            points="30,82 50,71 70,82 65,86 50,77 35,86"
            fill={isLight ? '#2a8f8d' : '#64748b'}
          />
          <polygon
            points="35,86 50,77 65,86 60,90 50,83 40,90"
            fill={isLight ? '#e89b27' : '#94a3b8'}
          />
          <polygon
            points="40,90 50,83 60,90 56,93 50,88 44,93"
            fill={isLight ? '#2a8f8d' : '#475569'}
          />
          <polygon
            points="44,93 50,88 56,93 50,96"
            fill={isLight ? '#a82d4a' : '#334155'}
          />

          {/* 7. Scalloped Feather Wings (Left & Right Flanks) */}
          {/* Left Wing Base */}
          <path
            d="M 25 48 C 15 48 7 60 7 74 C 7 88 14 96 25 96 C 26 84 26 64 25 48 Z"
            fill={isLight ? '#541c2c' : '#1e293b'}
          />
          <path
            d="M 25 48 C 22 62 22 82 25 96 C 20 96 16 88 16 74 C 16 60 20 48 25 48 Z"
            fill={isLight ? '#421424' : '#0f172a'}
            opacity="0.85"
          />
          {/* Left Wing Scallop Tiers */}
          <path d="M 10 50 C 16 46 24 48 24 58 C 18 60 10 58 10 50 Z" fill={isLight ? '#a82d4a' : '#475569'} />
          <path d="M 8 58 C 14 56 18 64 14 68 C 10 68 8 64 8 58 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
          <path d="M 14 58 C 20 56 24 64 20 68 C 16 68 14 64 14 58 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
          <path d="M 7 66 C 13 64 17 72 13 76 C 9 76 7 72 7 66 Z" fill={isLight ? '#785928' : '#334155'} />
          <path d="M 13 66 C 19 64 23 72 19 76 C 15 76 13 72 13 66 Z" fill={isLight ? '#a82d4a' : '#475569'} />
          <path d="M 8 74 C 14 72 18 80 14 84 C 10 84 8 80 8 74 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
          <path d="M 14 74 C 20 72 24 80 20 84 C 16 84 14 80 14 74 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
          <path d="M 9 82 C 15 80 19 88 15 92 C 11 92 9 88 9 82 Z" fill={isLight ? '#e89b27' : '#94a3b8'} />
          <path d="M 15 82 C 21 80 25 88 21 92 C 17 92 15 88 15 82 Z" fill={isLight ? '#a82d4a' : '#475569'} />

          {/* Right Wing Base */}
          <path
            d="M 75 48 C 85 48 93 60 93 74 C 93 88 86 96 75 96 C 74 84 74 64 75 48 Z"
            fill={isLight ? '#541c2c' : '#1e293b'}
          />
          <path
            d="M 75 48 C 78 62 78 82 75 96 C 80 96 84 88 84 74 C 84 60 80 48 75 48 Z"
            fill={isLight ? '#421424' : '#0f172a'}
            opacity="0.85"
          />
          {/* Right Wing Scallop Tiers */}
          <path d="M 90 50 C 84 46 76 48 76 58 C 82 60 90 58 90 50 Z" fill={isLight ? '#a82d4a' : '#475569'} />
          <path d="M 92 58 C 86 56 82 64 86 68 C 90 68 92 64 92 58 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
          <path d="M 86 58 C 80 56 76 64 80 68 C 84 68 86 64 86 58 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
          <path d="M 93 66 C 87 64 83 72 87 76 C 91 76 93 72 93 66 Z" fill={isLight ? '#785928' : '#334155'} />
          <path d="M 87 66 C 81 64 77 72 81 76 C 85 76 87 72 87 66 Z" fill={isLight ? '#a82d4a' : '#475569'} />
          <path d="M 92 74 C 86 72 82 80 86 84 C 90 84 92 80 92 74 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
          <path d="M 86 74 C 80 72 76 80 80 84 C 84 84 86 80 86 74 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
          <path d="M 91 82 C 85 80 81 88 85 92 C 89 92 91 88 91 82 Z" fill={isLight ? '#e89b27' : '#94a3b8'} />
          <path d="M 85 82 C 79 80 75 88 79 92 C 83 92 85 88 85 82 Z" fill={isLight ? '#a82d4a' : '#475569'} />
        </g>

        {/* ===============================================================
            PAWS / CLAWS (100% Static & Fixed - Firmly Attached to Button Edge)
            (No grey bar, zero animation, claws clasp directly onto button)
           =============================================================== */}
        <g fill="#f59e0b" stroke="#b45309" strokeWidth="0.8">
          {/* Left Claw (3 distinct toes firmly clasping onto button top) */}
          <path d="M 31 92 C 31 90 43 90 43 92 L 43 96 L 31 96 Z" />
          <path d="M 31 95 L 31 103 L 34.5 101 L 34.5 95 Z" />
          <path d="M 35 95 L 35 105 L 38.5 102 L 38.5 95 Z" />
          <path d="M 39 95 L 39 103 L 42.5 101 L 42.5 95 Z" />

          {/* Right Claw (3 distinct toes firmly clasping onto button top) */}
          <path d="M 57 92 C 57 90 69 90 69 92 L 69 96 L 57 96 Z" />
          <path d="M 57 95 L 57 103 L 60.5 101 L 60.5 95 Z" />
          <path d="M 61 95 L 61 105 L 64.5 102 L 64.5 95 Z" />
          <path d="M 65 95 L 65 103 L 68.5 101 L 68.5 95 Z" />
        </g>
      </svg>
    </div>
  );
};
