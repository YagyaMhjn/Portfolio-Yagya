import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Shield } from 'lucide-react';
import { sortCertificatesLatestFirst } from '../utils/dateUtils';
import { useScrollReveal } from '../utils/useScrollReveal';

const useCertColumnCount = () => {
  const getCols = () => {
    if (typeof window === 'undefined') return 2;
    return window.innerWidth >= 768 ? 2 : 1;
  };

  const [cols, setCols] = useState(getCols);

  useEffect(() => {
    const onResize = () => setCols(getCols());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return cols;
};

export const Certificates = () => {
  const { data } = usePortfolio();
  const { certificates } = data;
  const numCols = useCertColumnCount();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Arrange certificates chronologically (latest first)
  const sortedCertificates = sortCertificatesLatestFirst(certificates || []);

  const { registerCardRef, isCardActive } = useScrollReveal(sortedCertificates);

  const columns = Array.from({ length: numCols }, () => []);
  sortedCertificates.forEach((cert, idx) => {
    columns[idx % numCols].push(cert);
  });

  const renderCertCard = (cert) => {
    const active = isCardActive(cert.id);
    return (
      <div
        key={cert.id}
        ref={(el) => registerCardRef(cert.id, el)}
        onMouseMove={handleMouseMove}
        className={`glass-card glass-panel-hover rounded-2xl border overflow-hidden flex flex-col justify-between group cursor-default transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] relative ${
          active
            ? 'border-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/20'
            : 'border-white/[0.08] hover:border-white/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]'
        }`}
      >
        <div>
          {/* Revealed Top Certificate Media on Hover (desktop) or Center Screen on Scroll (mobile/tablet) */}
          {cert.media && (
            <div
              className={`overflow-hidden relative bg-zinc-950 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                active
                  ? 'max-h-[1600px] opacity-100 shadow-inner'
                  : 'max-h-0 opacity-0 lg:group-hover:max-h-[1600px] lg:group-hover:opacity-100 lg:delay-[250ms] lg:group-hover:delay-0'
              }`}
            >
              <div className={`w-full ${cert.mediaRatio === '4/3' ? 'aspect-[4/3]' : cert.mediaRatio === '1/1' ? 'aspect-square' : cert.mediaRatio === '16/9' ? 'aspect-video' : 'h-auto'} relative overflow-hidden flex items-center justify-center`}>
              <img
                src={cert.media}
                alt={cert.title}
                style={{
                  transform: `scale(${((cert.mediaScale || 100) / 100)}) translate(${cert.mediaX || 0}%, ${cert.mediaY || 0}%)`,
                  transformOrigin: 'center center',
                  objectFit: cert.mediaFit || 'contain',
                }}
                className={`w-full ${cert.mediaRatio === 'original' ? 'h-auto max-h-[700px] object-contain' : cert.mediaFit === 'cover' ? 'h-full object-cover' : 'h-full object-contain'} transition-transform duration-500 ease-out`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Card Content Body */}
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Shield size={13} className="text-zinc-300" />
              <span>{cert.issuer}</span>
              <span className="text-zinc-600">•</span>
              <span>{cert.date}</span>
            </div>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 px-2.5 rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-white/30 hover:scale-105 border border-white/[0.08] transition-all flex items-center gap-1 text-[11px] font-mono"
                title="Verify Certificate"
              >
                <span>Verify</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>

          <h3 className={`text-lg font-bold text-white mb-2 transition-colors ${active ? 'text-zinc-100' : 'group-hover:text-zinc-100'}`}>
            {cert.title}
          </h3>

          {/* Skills Tags */}
          {Array.isArray(cert.skills) && cert.skills.length > 0 && (
            <div className="pt-4 mt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
              {cert.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-zinc-900/90 text-zinc-300 text-[10px] font-mono border border-white/[0.05] group-hover:border-white/20 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clean Separation Line (No shadow) */}
        <div className="mb-8 pb-6 border-b-2 border-black/20 dark:border-white/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5">
            <span>✦</span> VERIFIED CREDENTIALS <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certificates & Accreditations
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            Professional certifications, specialized specializations, and verified technical honors.
          </p>
        </div>

        {/* Certificates Independent Columns Layout (Zero row gap across columns) */}
        <div className={`grid ${numCols === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-6 items-start`}>
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6">
              {col.map((cert) => renderCertCard(cert))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};