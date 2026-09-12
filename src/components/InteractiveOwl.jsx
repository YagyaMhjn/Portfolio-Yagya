import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/**
 * InteractiveOwl Component
 * - Exact vector reproduction of reference image (media_1789250478378.png):
 *   - Curved ear horns with dipped head line.
 *   - Forehead downward-pointing nested chevron crown.
 *   - Big concentric eyes with live pupil tracking in Dark Mode.
 *   - Sharp downward orange beak.
 *   - Chest geometric 'X' division with cream side triangles.
 *   - Lower belly nested downward chevron pyramid.
 *   - Rounded teardrop wings with multi-layered scalloped feather scales and crescent inner borders.
 *   - Two 3-toed golden claws firmly clasping the perch over the button ledge.
 * - In Dark Mode: Slate, silver, and graphite with amber accents & live tracking pupils.
 * - In Light Mode: Rich warm dark brown / chocolate with vibrant folk chevrons & scalloped plumage,
 *   sleeping closed eyelids with breathing motion, and progressive floating 'Zzz' particles.
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
  const MAX_PUPIL_OFFSET = 3.8; // Pupil travel distance inside eye

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
      { x: -3.2, y: -0.5 },
      { x: 3.2, y: -0.5 },
      { x: 0, y: -2.8 },
      { x: 0, y: 3.0 },
      { x: -2.2, y: 2.0 },
      { x: 2.2, y: 2.0 },
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
  useEffect(() => {
    if (!isLight || !isInsideRadius) return;

    let spawnInterval = null;

    const entryTimeout = setTimeout(() => {
      const spawnZ = () => {
        const scale = Z_SCALES[zCycleRef.current % 3];
        zCycleRef.current += 1;
        const particleId = Date.now() + Math.random();

        setZParticles((prev) => [...prev, { id: particleId, scale }]);

        setTimeout(() => {
          setZParticles((prev) => prev.filter((p) => p.id !== particleId));
        }, 2050);
      };

      spawnZ();
      spawnInterval = setInterval(spawnZ, 720);
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
      /* Firmly perched on top of button with claws overlapping border, enlarged size, NO hover scale */
      className={`absolute bottom-[calc(100%-8px)] sm:bottom-[calc(100%-10px)] right-5 sm:right-7 z-30 w-[70px] h-[82px] sm:w-[86px] sm:h-[100px] select-none cursor-pointer transition-transform duration-300 ${
        isChirping ? '-rotate-6' : ''
      } ${className}`}
      title={isLight ? 'Sleeping owl... (Hover near me to see dreams)' : 'Observant owl is watching!'}
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

      {/* Main Vector SVG Owl (Exact Reproduction of media_1789250478378.png) */}
      <svg
        viewBox="0 0 100 110"
        className={`w-full h-full overflow-visible drop-shadow-lg ${
          isLight ? 'animate-owl-breathe' : ''
        }`}
      >
        {/* ===============================================================
            1. MAIN HEAD & BODY SILHOUETTE
           =============================================================== */}
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

        {/* ===============================================================
            2. FOREHEAD NESTED CHEVRON CROWN (Between the Ears, Pointing Down)
           =============================================================== */}
        {/* Outer Chevron (Magenta / Slate) */}
        <polygon
          points="14,9 50,31 86,9 80,6 50,26 20,6"
          fill={isLight ? '#a82d4a' : '#475569'}
        />
        {/* 2nd Chevron (Teal / Medium Slate) */}
        <polygon
          points="20,6 50,26 80,6 74,4 50,21 26,4"
          fill={isLight ? '#2a8f8d' : '#64748b'}
        />
        {/* 3rd Chevron (Amber Orange / Light Slate) */}
        <polygon
          points="26,4 50,21 74,4 68,2 50,16 32,2"
          fill={isLight ? '#e05a36' : '#94a3b8'}
        />
        {/* Center Top Triangle (Yellow Ochre / Silver) */}
        <polygon
          points="32,2 50,16 68,2"
          fill={isLight ? '#e89b27' : '#cbd5e1'}
        />

        {/* ===============================================================
            3. EYES: WHITE CONCENTRIC RINGS & PUPILS
           =============================================================== */}
        {/* Left White Sclera Ring */}
        <circle cx="32" cy="33" r="15" fill="#ffffff" stroke={isLight ? '#3e2015' : '#1e293b'} strokeWidth="1" />
        {/* Right White Sclera Ring */}
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
          /* Awake Concentric Amber Iris & Black Pupil with Live Glare Tracking */
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

        {/* ===============================================================
            4. ORANGE TRIANGULAR BEAK
           =============================================================== */}
        <polygon
          points="44,35 56,35 50,52"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* ===============================================================
            5. CHEST 'X' DIVISION (Cream Side Panels & Dark Center)
           =============================================================== */}
        {/* Left Side Cream/Ivory Triangle */}
        <polygon
          points="25,48 50,65 25,78"
          fill={isLight ? '#fef3c7' : '#e2e8f0'}
        />
        {/* Right Side Cream/Ivory Triangle */}
        <polygon
          points="75,48 50,65 75,78"
          fill={isLight ? '#fde68a' : '#cbd5e1'}
        />
        {/* Upper Dark Triangular Sector under Beak */}
        <polygon
          points="25,48 50,52 75,48 50,65"
          fill={isLight ? '#321910' : '#1a1b22'}
        />
        {/* Shadow Accent on Left of Beak */}
        <polygon
          points="35,49 50,52 50,65"
          fill={isLight ? '#26120b' : '#0f1015'}
          opacity="0.45"
        />

        {/* ===============================================================
            6. LOWER BELLY NESTED CHEVRON PYRAMID
           =============================================================== */}
        {/* Chevron Layer 1 - Top Coral / Amber */}
        <polygon
          points="25,78 50,65 75,78 70,82 50,71 30,82"
          fill={isLight ? '#e05a36' : '#f59e0b'}
        />
        {/* Chevron Layer 2 - Teal / Medium Slate */}
        <polygon
          points="30,82 50,71 70,82 65,86 50,77 35,86"
          fill={isLight ? '#2a8f8d' : '#64748b'}
        />
        {/* Chevron Layer 3 - Yellow / Silver */}
        <polygon
          points="35,86 50,77 65,86 60,90 50,83 40,90"
          fill={isLight ? '#e89b27' : '#94a3b8'}
        />
        {/* Chevron Layer 4 - Teal / Slate */}
        <polygon
          points="40,90 50,83 60,90 56,93 50,88 44,93"
          fill={isLight ? '#2a8f8d' : '#475569'}
        />
        {/* Chevron Layer 5 - Bottom Magenta / Deep Slate */}
        <polygon
          points="44,93 50,88 56,93 50,96"
          fill={isLight ? '#a82d4a' : '#334155'}
        />

        {/* ===============================================================
            7. SCALLOPED FEATHER WINGS (Left & Right Flanks)
           =============================================================== */}
        {/* --- LEFT WING --- */}
        {/* Left Wing Outer Base Silhouette */}
        <path
          d="M 25 48 C 15 48 7 60 7 74 C 7 88 14 96 25 96 C 26 84 26 64 25 48 Z"
          fill={isLight ? '#541c2c' : '#1e293b'}
        />
        {/* Left Wing Inner Crescent Border (Plum/Dark Slate) */}
        <path
          d="M 25 48 C 22 62 22 82 25 96 C 20 96 16 88 16 74 C 16 60 20 48 25 48 Z"
          fill={isLight ? '#421424' : '#0f172a'}
          opacity="0.85"
        />
        {/* Scallop Tier 1 (Magenta Top Cap) */}
        <path d="M 10 50 C 16 46 24 48 24 58 C 18 60 10 58 10 50 Z" fill={isLight ? '#a82d4a' : '#475569'} />
        {/* Scallop Tier 2 (Orange & Teal Scales) */}
        <path d="M 8 58 C 14 56 18 64 14 68 C 10 68 8 64 8 58 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
        <path d="M 14 58 C 20 56 24 64 20 68 C 16 68 14 64 14 58 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
        {/* Scallop Tier 3 (Olive & Magenta Scales) */}
        <path d="M 7 66 C 13 64 17 72 13 76 C 9 76 7 72 7 66 Z" fill={isLight ? '#785928' : '#334155'} />
        <path d="M 13 66 C 19 64 23 72 19 76 C 15 76 13 72 13 66 Z" fill={isLight ? '#a82d4a' : '#475569'} />
        {/* Scallop Tier 4 (Orange & Teal Scales) */}
        <path d="M 8 74 C 14 72 18 80 14 84 C 10 84 8 80 8 74 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
        <path d="M 14 74 C 20 72 24 80 20 84 C 16 84 14 80 14 74 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
        {/* Scallop Tier 5 (Yellow & Magenta Lower Scales) */}
        <path d="M 9 82 C 15 80 19 88 15 92 C 11 92 9 88 9 82 Z" fill={isLight ? '#e89b27' : '#94a3b8'} />
        <path d="M 15 82 C 21 80 25 88 21 92 C 17 92 15 88 15 82 Z" fill={isLight ? '#a82d4a' : '#475569'} />

        {/* --- RIGHT WING (Symmetrical) --- */}
        {/* Right Wing Outer Base Silhouette */}
        <path
          d="M 75 48 C 85 48 93 60 93 74 C 93 88 86 96 75 96 C 74 84 74 64 75 48 Z"
          fill={isLight ? '#541c2c' : '#1e293b'}
        />
        {/* Right Wing Inner Crescent Border (Plum/Dark Slate) */}
        <path
          d="M 75 48 C 78 62 78 82 75 96 C 80 96 84 88 84 74 C 84 60 80 48 75 48 Z"
          fill={isLight ? '#421424' : '#0f172a'}
          opacity="0.85"
        />
        {/* Scallop Tier 1 (Magenta Top Cap) */}
        <path d="M 90 50 C 84 46 76 48 76 58 C 82 60 90 58 90 50 Z" fill={isLight ? '#a82d4a' : '#475569'} />
        {/* Scallop Tier 2 (Orange & Teal Scales) */}
        <path d="M 92 58 C 86 56 82 64 86 68 C 90 68 92 64 92 58 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
        <path d="M 86 58 C 80 56 76 64 80 68 C 84 68 86 64 86 58 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
        {/* Scallop Tier 3 (Olive & Magenta Scales) */}
        <path d="M 93 66 C 87 64 83 72 87 76 C 91 76 93 72 93 66 Z" fill={isLight ? '#785928' : '#334155'} />
        <path d="M 87 66 C 81 64 77 72 81 76 C 85 76 87 72 87 66 Z" fill={isLight ? '#a82d4a' : '#475569'} />
        {/* Scallop Tier 4 (Orange & Teal Scales) */}
        <path d="M 92 74 C 86 72 82 80 86 84 C 90 84 92 80 92 74 Z" fill={isLight ? '#e05a36' : '#f59e0b'} />
        <path d="M 86 74 C 80 72 76 80 80 84 C 84 84 86 80 86 74 Z" fill={isLight ? '#2a8f8d' : '#64748b'} />
        {/* Scallop Tier 5 (Yellow & Magenta Lower Scales) */}
        <path d="M 91 82 C 85 80 81 88 85 92 C 89 92 91 88 91 82 Z" fill={isLight ? '#e89b27' : '#94a3b8'} />
        <path d="M 85 82 C 79 80 75 88 79 92 C 83 92 85 88 85 82 Z" fill={isLight ? '#a82d4a' : '#475569'} />

        {/* ===============================================================
            8. HORIZONTAL PERCH BAR & THREE-TOED GOLDEN CLAWS
           =============================================================== */}
        {/* Thin Horizontal Perch Wire/Branch */}
        <rect
          x="0"
          y="96"
          width="100"
          height="4"
          fill={isLight ? '#6b7280' : '#3f4553'}
        />

        {/* Tail Tip (under perch bar) */}
        <rect
          x="48"
          y="97"
          width="4"
          height="5"
          fill={isLight ? '#2a150e' : '#141418'}
        />

        {/* Left Three-Toed Claw (Firmly gripping over the perch/button ledge) */}
        <g fill="#f59e0b" stroke="#b45309" strokeWidth="0.8">
          <path d="M 31 93 C 31 91 43 91 43 93 L 43 96 L 31 96 Z" />
          <path d="M 31 96 L 31 103 L 34.5 101 L 34.5 96 Z" />
          <path d="M 35 96 L 35 104 L 38.5 102 L 38.5 96 Z" />
          <path d="M 39 96 L 39 103 L 42.5 101 L 42.5 96 Z" />
        </g>

        {/* Right Three-Toed Claw (Firmly gripping over the perch/button ledge) */}
        <g fill="#f59e0b" stroke="#b45309" strokeWidth="0.8">
          <path d="M 57 93 C 57 91 69 91 69 93 L 69 96 L 57 96 Z" />
          <path d="M 57 96 L 57 103 L 60.5 101 L 60.5 96 Z" />
          <path d="M 61 96 L 61 104 L 64.5 102 L 64.5 96 Z" />
          <path d="M 65 96 L 65 103 L 68.5 101 L 68.5 96 Z" />
        </g>
      </svg>
    </div>
  );
};
