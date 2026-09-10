import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const MOTIVATIONAL_PHRASES = [
  "Loading success...",
  "Success in progress...",
  "Winning... please wait...",
  "Great things take time...",
  "A career in the making...",
  "Synthesizing neural architectures...",
  "Compiling high-performance modules...",
  "Optimizing data pipelines...",
  "Architecting intelligent systems...",
  "Accelerating compute nodes..."
];

// 1. Growing Bar Graph Visualization
const BarChartVisualizer = ({ progress, isLight }) => {
  const bars = [
    { target: 45, delay: '0ms' },
    { target: 70, delay: '80ms' },
    { target: 35, delay: '160ms' },
    { target: 90, delay: '240ms' },
    { target: 60, delay: '320ms' },
    { target: 100, delay: '400ms' },
    { target: 80, delay: '480ms' },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Visualizer Frame */}
      <div className={`w-48 h-24 p-3 rounded-xl ${isLight ? 'bg-zinc-100 border border-black/15 shadow-[0_0_20px_rgba(0,0,0,0.05)]' : 'bg-zinc-950/90 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]'} flex items-end justify-between gap-2 relative overflow-hidden`}>
        {/* Subtle background grid lines */}
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]'} bg-[size:12px_12px]`} />
        
        {bars.map((bar, idx) => {
          const currentHeight = Math.min(100, (progress / 100) * bar.target * 1.1);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end z-10">
              <div
                className={`w-full rounded-t-sm ${isLight ? 'bg-gradient-to-t from-zinc-400 via-zinc-700 to-black' : 'bg-gradient-to-t from-zinc-700 via-zinc-400 to-white'} transition-all duration-300 ease-out relative`}
                style={{
                  height: `${Math.max(8, currentHeight)}%`,
                  boxShadow: currentHeight > 50 ? (isLight ? '0 0 10px rgba(0,0,0,0.2)' : '0 0 10px rgba(255,255,255,0.3)') : 'none'
                }}
              >
                {/* Glowing peak dot */}
                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isLight ? 'bg-black shadow-[0_0_6px_#000]' : 'bg-white shadow-[0_0_6px_#fff]'}`} />
              </div>
            </div>
          );
        })}
      </div>
      <div className={`flex items-center justify-between w-48 mt-1.5 text-[9px] font-mono ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
        <span>METRIC_STREAM</span>
        <span className={isLight ? 'text-black font-bold' : 'text-zinc-300'}>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// 2. Increasing Line Chart Visualization
const LineChartVisualizer = ({ progress, isLight }) => {
  const points = [
    [0, 55],
    [25, 48],
    [50, 60],
    [75, 30],
    [100, 40],
    [125, 18],
    [150, 24],
    [175, 8],
    [190, 4]
  ];

  // Calculate current visible path based on progress
  const visibleCount = Math.max(2, Math.floor((progress / 100) * points.length));
  const currentPoints = points.slice(0, visibleCount);
  const pathD = currentPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ');
  const lastPoint = currentPoints[currentPoints.length - 1] || [0, 55];

  return (
    <div className="flex flex-col items-center">
      <div className={`w-52 h-24 p-2 rounded-xl ${isLight ? 'bg-zinc-100 border border-black/15 shadow-[0_0_20px_rgba(0,0,0,0.05)]' : 'bg-zinc-950/90 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]'} relative overflow-hidden flex items-center justify-center`}>
        {/* Grid lines */}
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]'} bg-[size:10px_10px]`} />
        
        <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 190 65">
          {/* Gradient fill underneath */}
          {currentPoints.length > 1 && (
            <path
              d={`${pathD} L ${lastPoint[0]} 65 L 0 65 Z`}
              fill={isLight ? "url(#lineGradientLight)" : "url(#lineGradientDark)"}
              opacity="0.3"
            />
          )}
          {/* Active growing line */}
          <path
            d={pathD}
            fill="none"
            stroke={isLight ? "#09090b" : "#ffffff"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-150 ease-out"
          />
          {/* Tracer dot at current peak */}
          <circle
            cx={lastPoint[0]}
            cy={lastPoint[1]}
            r="3.5"
            fill={isLight ? "#09090b" : "#ffffff"}
            className="animate-ping opacity-75"
          />
          <circle
            cx={lastPoint[0]}
            cy={lastPoint[1]}
            r="3"
            fill={isLight ? "#09090b" : "#ffffff"}
            filter={isLight ? "drop-shadow(0 0 4px rgba(0,0,0,0.6))" : "drop-shadow(0 0 6px rgba(255,255,255,0.9))"}
          />
          <defs>
            <linearGradient id="lineGradientDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradientLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#09090b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={`flex items-center justify-between w-52 mt-1.5 text-[9px] font-mono ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
        <span>GROWTH_TRAJECTORY</span>
        <span className={isLight ? 'text-black font-bold' : 'text-zinc-300'}>+{Math.round(progress * 1.42)}%</span>
      </div>
    </div>
  );
};

// 3. Popping Bubble Chart Visualization
const BubbleChartVisualizer = ({ progress, isLight }) => {
  const bubbles = [
    { x: '18%', y: '50%', size: 32, label: 'AI', delay: 10 },
    { x: '42%', y: '32%', size: 44, label: 'SYS', delay: 25 },
    { x: '68%', y: '60%', size: 38, label: 'DATA', delay: 40 },
    { x: '82%', y: '30%', size: 28, label: 'OPS', delay: 60 },
    { x: '35%', y: '72%', size: 24, label: 'DEV', delay: 75 },
    { x: '55%', y: '78%', size: 20, label: 'NET', delay: 85 },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className={`w-52 h-24 rounded-xl ${isLight ? 'bg-zinc-100 border border-black/15 shadow-[0_0_20px_rgba(0,0,0,0.05)]' : 'bg-zinc-950/90 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]'} relative overflow-hidden`}>
        {/* Ambient radial glow */}
        <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]'}`} />

        {/* Popping Bubbles */}
        {bubbles.map((b, idx) => {
          const isPopped = progress >= b.delay;
          const scale = isPopped ? 1 : 0;
          return (
            <div
              key={idx}
              className={`absolute rounded-full flex items-center justify-center border ${
                isLight ? 'border-black/30 bg-white text-black shadow-md' : 'border-white/30 bg-zinc-900/90 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
              } font-mono text-[9px] font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
              style={{
                left: b.x,
                top: b.y,
                width: `${b.size}px`,
                height: `${b.size}px`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: isPopped ? 1 : 0
              }}
            >
              <span>{b.label}</span>
            </div>
          );
        })}
      </div>
      <div className={`flex items-center justify-between w-52 mt-1.5 text-[9px] font-mono ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
        <span>CLUSTER_MATRIX</span>
        <span className={isLight ? 'text-black font-bold' : 'text-zinc-300'}>{bubbles.filter(b => progress >= b.delay).length} / {bubbles.length}</span>
      </div>
    </div>
  );
};

// 4. Radial Telemetry Radar
const RadialRadarVisualizer = ({ progress, isLight }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`w-48 h-24 p-2 rounded-xl ${isLight ? 'bg-zinc-100 border border-black/15 shadow-[0_0_20px_rgba(0,0,0,0.05)]' : 'bg-zinc-950/90 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]'} relative overflow-hidden flex items-center justify-center`}>
        {/* Radar Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke={isLight ? "#d4d4d8" : "#27272a"}
              strokeWidth="4"
            />
            {/* Animated filling circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke={isLight ? "#09090b" : "#ffffff"}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
              filter={isLight ? "drop-shadow(0 0 4px rgba(0,0,0,0.4))" : "drop-shadow(0 0 6px rgba(255,255,255,0.6))"}
            />
          </svg>

          {/* Center percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
            <span className={`text-xs font-bold ${isLight ? 'text-black' : 'text-white'}`}>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
      <div className={`flex items-center justify-between w-48 mt-1.5 text-[9px] font-mono ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
        <span>RADIAL_TELEMETRY</span>
        <span className={isLight ? 'text-black font-bold' : 'text-zinc-300'}>SYNCING</span>
      </div>
    </div>
  );
};

export const SectionTransitionLoader = () => {
  const { activePage, theme } = usePortfolio();
  const isLight = theme === 'light';
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeVisualizerIndex, setActiveVisualizerIndex] = useState(0);
  const [activePhrase, setActivePhrase] = useState(MOTIVATIONAL_PHRASES[0]);
  
  const previousPageRef = useRef(null);
  const lastIndexRef = useRef(0);
  const lastPhraseRef = useRef(0);

  useEffect(() => {
    // Only trigger loader when changing between different pages
    if (previousPageRef.current === activePage) return;
    previousPageRef.current = activePage;

    // Pick a random visualizer (different from the last one)
    let nextIndex = Math.floor(Math.random() * 4);
    if (nextIndex === lastIndexRef.current) {
      nextIndex = (nextIndex + 1) % 4;
    }
    lastIndexRef.current = nextIndex;
    setActiveVisualizerIndex(nextIndex);

    // Pick a random motivational phrase (different from the last one)
    let phraseIdx = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
    if (phraseIdx === lastPhraseRef.current) {
      phraseIdx = (phraseIdx + 1) % MOTIVATIONAL_PHRASES.length;
    }
    lastPhraseRef.current = phraseIdx;
    setActivePhrase(MOTIVATIONAL_PHRASES[phraseIdx]);

    // Start loading sequence
    setLoading(true);
    setProgress(5);

    const startTime = Date.now();
    const duration = 2600; // 2.6 seconds so user clearly sees and enjoys the data visualization

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 220);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [activePage]);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isLight ? 'bg-white/80' : 'bg-black/75'} backdrop-blur-md transition-opacity duration-300 ease-out animate-fadeIn pointer-events-auto select-none`}
      aria-live="polite"
    >
      <div className={`glass-card p-6 sm:p-8 rounded-2xl border ${isLight ? 'border-black/15 bg-white/95 shadow-[0_0_50px_rgba(0,0,0,0.15)]' : 'border-white/15 bg-zinc-950/90 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.08)]'} flex flex-col items-center max-w-xs w-full mx-4`}>
        
        {/* Dynamic Randomized Data Visualization */}
        <div className="mb-4 flex items-center justify-center">
          {activeVisualizerIndex === 0 && <BarChartVisualizer progress={progress} isLight={isLight} />}
          {activeVisualizerIndex === 1 && <LineChartVisualizer progress={progress} isLight={isLight} />}
          {activeVisualizerIndex === 2 && <BubbleChartVisualizer progress={progress} isLight={isLight} />}
          {activeVisualizerIndex === 3 && <RadialRadarVisualizer progress={progress} isLight={isLight} />}
        </div>

        {/* Dynamic Randomized Motivational Text */}
        <div className="text-center space-y-1">
          <p className={`text-xs sm:text-sm font-bold font-mono ${isLight ? 'text-black' : 'text-white'} tracking-wide`}>
            {activePhrase}
          </p>
          <p className={`text-[10px] font-mono ${isLight ? 'text-zinc-600' : 'text-zinc-400'} uppercase tracking-widest`}>
            INITIALIZING SECTION • {Math.round(progress)}%
          </p>
        </div>

        {/* Glowing Linear Progress Bar */}
        <div className={`w-full h-1 ${isLight ? 'bg-zinc-200 border-black/10' : 'bg-zinc-900 border-white/5'} rounded-full mt-4 overflow-hidden border`}>
          <div
            className={`h-full ${isLight ? 'bg-gradient-to-r from-zinc-500 via-zinc-800 to-black shadow-[0_0_8px_rgba(0,0,0,0.4)]' : 'bg-gradient-to-r from-zinc-500 via-zinc-200 to-white shadow-[0_0_8px_#ffffff]'} transition-all duration-100 ease-out rounded-full`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};