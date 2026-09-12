import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

/**
 * InteractiveOwl Component
 * - Silhouette & anatomy matching user's reference image:
 *   - Curved ear tufts with scooped top head line.
 *   - Forehead nested chevron stripes.
 *   - Concentric circular eyes with live cursor tracking in Dark Mode.
 *   - Downward triangular beak.
 *   - Chest hourglass/diamond with nested downward belly chevrons.
 *   - Rich scalloped multi-layered feather scales on both wings.
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
  const MAX_PUPIL_OFFSET = 4.2; // Maximum pupil travel distance inside eye

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
      className={`absolute bottom-[calc(100%-8px)] sm:bottom-[calc(100%-10px)] right-5 sm:right-7 z-30 w-[68px] h-[78px] sm:w-[84px] sm:h-[96px] select-none cursor-pointer transition-transform duration-300 ${
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

      {/* Main Vector SVG Owl (Detailed Chevron & Scalloped Wing Body) */}
      <svg
        viewBox="0 0 100 120"
        className={`w-full h-full overflow-visible drop-shadow-lg ${
          isLight ? 'animate-owl-breathe' : ''
        }`}
      >
        {/* ===============================================================
            1. MAIN BODY SILHOUETTE (Pointed Ear Horns + Organic Flanks)
           =============================================================== */}
        <path
          d="M 12 10 
             C 24 19 36 23 50 23 
             C 64 23 76 19 88 10 
             C 85 24 92 38 92 60 
             C 92 82 89 106 84 106 
             L 16 106 
             C 11 106 8 82 8 60 
             C 8 38 15 24 12 10 Z"
          fill={isLight ? '#3e2015' : '#141418'}
          stroke={isLight ? '#2a150e' : '#333544'}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* ===============================================================
            2. FOREHEAD NESTED CHEVRON STRIPES
           =============================================================== */}
        {/* Layer 1 (Outer Chevron Band) */}
        <polygon
          points="18,17 50,38 82,17 76,14 50,33 24,14"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Layer 2 (Middle Chevron Band) */}
        <polygon
          points="24,14 50,33 76,14 70,11 50,28 30,11"
          fill={isLight ? '#d97706' : '#64748b'}
        />
        {/* Layer 3 (Inner Chevron Band) */}
        <polygon
          points="30,11 50,28 70,11 64,8 50,23 36,8"
          fill={isLight ? '#fcd34d' : '#94a3b8'}
        />
        {/* Layer 4 (Top Peak Triangle) */}
        <polygon
          points="36,8 50,23 64,8"
          fill={isLight ? '#fef3c7' : '#cbd5e1'}
        />

        {/* ===============================================================
            3. SCALLOPED WINGS (Left & Right Flanks with Layered Feathers)
           =============================================================== */}
        {/* Left Wing Outer Contour Base */}
        <path
          d="M 28 54 C 18 54 8 66 8 80 C 8 94 15 106 28 106 C 30 92 30 70 28 54 Z"
          fill={isLight ? '#543327' : '#1e293b'}
        />
        {/* Left Wing Tier 1 (Shoulder Cap) */}
        <path
          d="M 12 56 C 20 54 28 56 28 66 C 20 68 12 66 12 56 Z"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Left Wing Tier 2 (Scalloped Scales) */}
        <path
          d="M 10 66 C 18 64 22 74 18 78 C 14 78 10 74 10 66 Z"
          fill={isLight ? '#d97706' : '#64748b'}
        />
        <path
          d="M 18 66 C 24 64 28 74 24 78 C 20 78 18 74 18 66 Z"
          fill={isLight ? '#fcd34d' : '#94a3b8'}
        />
        {/* Left Wing Tier 3 (Scalloped Scales) */}
        <path
          d="M 9 76 C 17 74 21 84 17 88 C 13 88 9 84 9 76 Z"
          fill={isLight ? '#785928' : '#334155'}
        />
        <path
          d="M 17 76 C 23 74 27 84 23 88 C 19 88 17 84 17 76 Z"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Left Wing Tier 4 (Lower Feather Scales) */}
        <path
          d="M 10 86 C 18 84 22 94 18 98 C 14 98 10 94 10 86 Z"
          fill={isLight ? '#d97706' : '#64748b'}
        />
        <path
          d="M 18 86 C 24 84 28 94 24 98 C 20 98 18 94 18 86 Z"
          fill={isLight ? '#fcd34d' : '#94a3b8'}
        />

        {/* Right Wing Outer Contour Base */}
        <path
          d="M 72 54 C 82 54 92 66 92 80 C 92 94 85 106 72 106 C 70 92 70 70 72 54 Z"
          fill={isLight ? '#543327' : '#1e293b'}
        />
        {/* Right Wing Tier 1 (Shoulder Cap) */}
        <path
          d="M 88 56 C 80 54 72 56 72 66 C 80 68 88 66 88 56 Z"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Right Wing Tier 2 (Scalloped Scales) */}
        <path
          d="M 90 66 C 82 64 78 74 82 78 C 86 78 90 74 90 66 Z"
          fill={isLight ? '#d97706' : '#64748b'}
        />
        <path
          d="M 82 66 C 76 64 72 74 76 78 C 80 78 82 74 82 66 Z"
          fill={isLight ? '#fcd34d' : '#94a3b8'}
        />
        {/* Right Wing Tier 3 (Scalloped Scales) */}
        <path
          d="M 91 76 C 83 74 79 84 83 88 C 87 88 91 84 91 76 Z"
          fill={isLight ? '#785928' : '#334155'}
        />
        <path
          d="M 83 76 C 77 74 73 84 77 88 C 81 88 83 84 83 76 Z"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Right Wing Tier 4 (Lower Feather Scales) */}
        <path
          d="M 90 86 C 82 84 78 94 82 98 C 86 98 90 94 90 86 Z"
          fill={isLight ? '#d97706' : '#64748b'}
        />
        <path
          d="M 82 86 C 76 84 72 94 76 98 C 80 98 82 94 82 86 Z"
          fill={isLight ? '#fcd34d' : '#94a3b8'}
        />

        {/* ===============================================================
            4. CHEST / BELLY SPLIT DIAMOND & NESTED BELLY CHEVRONS
           =============================================================== */}
        {/* Upper Chest Split Diamond (Ivory/Cream and Tan / Silver) */}
        {/* Left Half */}
        <polygon
          points="50,60 28,86 50,86"
          fill={isLight ? '#fef3c7' : '#f1f5f9'}
        />
        {/* Right Half */}
        <polygon
          points="50,60 72,86 50,86"
          fill={isLight ? '#fcd34d' : '#cbd5e1'}
        />

        {/* Lower Belly Nested Chevrons (Mirroring forehead chevrons downwards) */}
        {/* Layer 1 (Outer Belly Chevron) */}
        <polygon
          points="28,86 50,106 72,86 66,86 50,101 34,86"
          fill={isLight ? '#c25e37' : '#475569'}
        />
        {/* Layer 2 (Middle Belly Chevron) */}
        <polygon
          points="34,86 50,101 66,86 60,86 50,96 40,86"
          fill={isLight ? '#d97706' : '#64748b'}
        />
        {/* Layer 3 (Inner Belly Triangle) */}
        <polygon
          points="40,86 50,96 60,86"
          fill={isLight ? '#b45309' : '#334155'}
        />

        {/* ===============================================================
            5. EYES SYSTEM (Concentric Circles & Live Tracking / Sleeping)
           =============================================================== */}
        {/* Outer White Sclera Rings */}
        <circle cx="32" cy="42" r="15" fill="#ffffff" stroke={isLight ? '#3e2015' : '#1e293b'} strokeWidth="1" />
        <circle cx="68" cy="42" r="15" fill="#ffffff" stroke={isLight ? '#3e2015' : '#1e293b'} strokeWidth="1" />

        {isLight || isBlinking ? (
          /* Sleeping / Blinking State: Sleek Bauhaus Closed Eyelids */
          <g className="transition-opacity duration-300 ease-in-out">
            {/* Left Closed Eye Slit */}
            <line
              x1="20"
              y1="42"
              x2="44"
              y2="42"
              stroke={isLight ? '#26120b' : '#0f172a'}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 22 38 Q 32 34 42 38"
              fill="none"
              stroke={isLight ? '#784533' : '#94a3b8'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Right Closed Eye Slit */}
            <line
              x1="56"
              y1="42"
              x2="80"
              y2="42"
              stroke={isLight ? '#26120b' : '#0f172a'}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 58 38 Q 68 34 78 38"
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
            <circle cx="32" cy="42" r="10.2" fill="#f59e0b" />
            <circle cx="68" cy="42" r="10.2" fill="#f59e0b" />

            {/* Left Pupil + Specular Catchlight */}
            <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
              <circle cx="32" cy="42" r="6" fill="#09090b" />
              <circle cx="30.2" cy="40" r="2" fill="#ffffff" />
            </g>

            {/* Right Pupil + Specular Catchlight */}
            <g transform={`translate(${pupilPos.x}, ${pupilPos.y})`}>
              <circle cx="68" cy="42" r="6" fill="#09090b" />
              <circle cx="66.2" cy="40" r="2" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* ===============================================================
            6. SHARP GEOMETRIC BEAK
           =============================================================== */}
        <polygon
          points="50,42 44,52 50,62 56,52"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* ===============================================================
            7. GEOMETRIC PERCH BAR & THREE-TOED CLAWS
           =============================================================== */}
        {/* Horizontal Perch Crossbar */}
        <rect
          x="12"
          y="108"
          width="76"
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
          <rect x="29" y="104" width="14" height="6" rx="2" />
          <rect x="29" y="109" width="3.8" height="8" rx="1.6" />
          <rect x="34.1" y="109" width="3.8" height="8.8" rx="1.6" />
          <rect x="39.2" y="109" width="3.8" height="8" rx="1.6" />
        </g>

        {/* Right Geometric Claw (3 rounded toes firmly clasping the button) */}
        <g fill="#fbbf24" stroke="#b45309" strokeWidth="0.8">
          <rect x="57" y="104" width="14" height="6" rx="2" />
          <rect x="57" y="109" width="3.8" height="8" rx="1.6" />
          <rect x="62.1" y="109" width="3.8" height="8.8" rx="1.6" />
          <rect x="67.2" y="109" width="3.8" height="8" rx="1.6" />
        </g>
      </svg>
    </div>
  );
};
