import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move, RotateCcw, Maximize2, Crop, Sliders } from 'lucide-react';

export const MediaAlignmentStudio = ({
  media,
  mediaScale = 100,
  mediaX = 0,
  mediaY = 0,
  mediaFit = 'cover',
  mediaRatio = '16/9',
  onChange,
  title = 'Image Framing & Alignment Studio',
  subtitle = 'Preview how your image appears in cards. Click and drag or use sliders to zoom, reposition, and adjust aspect ratio.'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e) => {
    if (!media) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: mediaX || 0,
      initialY: mediaY || 0,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.35;
    const deltaY = (e.clientY - dragStartRef.current.y) * 0.35;
    const newX = Math.min(80, Math.max(-80, Math.round(dragStartRef.current.initialX + deltaX)));
    const newY = Math.min(80, Math.max(-80, Math.round(dragStartRef.current.initialY + deltaY)));
    onChange({
      mediaScale,
      mediaX: newX,
      mediaY: newY,
      mediaFit,
      mediaRatio
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, mediaScale, mediaX, mediaY, mediaFit, mediaRatio]);

  const handleReset = () => {
    onChange({
      mediaScale: 100,
      mediaX: 0,
      mediaY: 0,
      mediaFit: 'cover',
      mediaRatio: '16/9'
    });
  };

  if (!media) return null;

  const ratioClass = 
    mediaRatio === '16/9' ? 'aspect-video' :
    mediaRatio === '4/3' ? 'aspect-[4/3]' :
    mediaRatio === '1/1' ? 'aspect-square' : 'aspect-video';

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-black/50 border border-white/[0.1] space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <label className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={13} className="text-amber-400" />
            <span>{title}</span>
          </label>
          <p className="text-[11px] text-zinc-400 max-w-lg mt-0.5">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-[11px] font-mono transition-all"
          title="Reset Zoom & Alignment to Center"
        >
          <RotateCcw size={12} />
          <span>Reset Default</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Interactive Live Card Preview Window */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5 px-1">
            <span className="flex items-center gap-1">
              <Move size={11} />
              <span>Click & Drag to Reposition</span>
            </span>
            <span>{mediaRatio.toUpperCase()} • {mediaFit.toUpperCase()}</span>
          </div>

          <div
            onMouseDown={handleMouseDown}
            className={`relative w-full ${ratioClass} max-h-56 rounded-xl overflow-hidden border border-white/20 bg-zinc-950 shadow-xl select-none ${
              isDragging ? 'cursor-grabbing ring-2 ring-white/50' : 'cursor-grab hover:border-white/40'
            } transition-all`}
          >
            <img
              src={media}
              alt="Media Preview"
              style={{
                transform: `scale(${(mediaScale || 100) / 100}) translate(${mediaX || 0}%, ${mediaY || 0}%)`,
                transformOrigin: 'center center',
                objectFit: mediaFit === 'contain' ? 'contain' : 'cover',
                width: '100%',
                height: '100%'
              }}
              className="transition-transform duration-75 select-none pointer-events-none"
              draggable={false}
            />

            {/* Subtle overlay indicator */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300 border border-white/10 backdrop-blur-sm pointer-events-none">
              Live Frame
            </div>
          </div>

          <div className="mt-2 text-[10px] font-mono text-zinc-400 text-center">
            X: <span className="text-white font-semibold">{mediaX || 0}%</span> | Y: <span className="text-white font-semibold">{mediaY || 0}%</span> | Zoom: <span className="text-white font-semibold">{mediaScale || 100}%</span>
          </div>
        </div>

        {/* Framing Controls, Aspect Ratio & Sliders */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Aspect Ratio Options */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">Card Aspect Ratio:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: '16/9', label: '16:9 Wide' },
                { id: '4/3', label: '4:3 Photo' },
                { id: '1/1', label: '1:1 Square' },
                { id: 'original', label: 'Original' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onChange({ mediaScale, mediaX, mediaY, mediaFit: r.id === 'original' ? 'contain' : mediaFit, mediaRatio: r.id })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all ${
                    mediaRatio === r.id
                      ? 'bg-white text-black font-bold border-white shadow-md'
                      : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Mode Toggle */}
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1.5">Image Fit Mode:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ mediaScale, mediaX, mediaY, mediaFit: 'cover', mediaRatio })}
                className={`py-1.5 px-3 rounded-lg text-xs font-mono border transition-all flex items-center justify-center gap-1.5 ${
                  mediaFit === 'cover'
                    ? 'bg-white text-black font-bold border-white shadow-md'
                    : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Crop size={12} />
                <span>Fill / Cover (Crop & Pan)</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ mediaScale, mediaX, mediaY, mediaFit: 'contain', mediaRatio })}
                className={`py-1.5 px-3 rounded-lg text-xs font-mono border transition-all flex items-center justify-center gap-1.5 ${
                  mediaFit === 'contain'
                    ? 'bg-white text-black font-bold border-white shadow-md'
                    : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Maximize2 size={12} />
                <span>Fit / Contain (Full Image)</span>
              </button>
            </div>
          </div>

          {/* Zoom Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
              <span className="flex items-center gap-1.5">
                <ZoomIn size={12} className="text-zinc-400" />
                <span>Zoom Scale:</span>
              </span>
              <span className="text-white font-bold">{mediaScale || 100}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChange({ mediaScale: Math.max(50, (mediaScale || 100) - 5), mediaX, mediaY, mediaFit, mediaRatio })}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300"
              >
                <ZoomOut size={12} />
              </button>
              <input
                type="range"
                min="50"
                max="250"
                step="1"
                value={mediaScale || 100}
                onChange={(e) => onChange({ mediaScale: Number(e.target.value), mediaX, mediaY, mediaFit, mediaRatio })}
                className="flex-1 accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                onClick={() => onChange({ mediaScale: Math.min(250, (mediaScale || 100) + 5), mediaX, mediaY, mediaFit, mediaRatio })}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300"
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>

          {/* X and Y Sliders */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 mb-1">
                <span>X Offset:</span>
                <span className="text-white font-bold">{mediaX || 0}%</span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                step="1"
                value={mediaX || 0}
                onChange={(e) => onChange({ mediaScale, mediaX: Number(e.target.value), mediaY, mediaFit, mediaRatio })}
                className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 mb-1">
                <span>Y Offset:</span>
                <span className="text-white font-bold">{mediaY || 0}%</span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                step="1"
                value={mediaY || 0}
                onChange={(e) => onChange({ mediaScale, mediaX: Number(e.target.value), mediaY, mediaFit, mediaRatio })}
                className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
