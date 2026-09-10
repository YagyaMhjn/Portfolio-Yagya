import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Shield } from 'lucide-react';

export const Certificates = () => {
  const { data } = usePortfolio();
  const { certificates } = data;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 pb-6 border-b border-white/[0.06]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5 shadow-[0_0_12px_rgba(255,255,255,0.02)]">
            <span>✦</span> VERIFIED CREDENTIALS <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certificates & Accreditations
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            Professional certifications, specialized specializations, and verified technical honors.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onMouseMove={handleMouseMove}
              className="glass-card glass-panel-hover p-6 sm:p-7 rounded-2xl border border-white/[0.08] flex flex-col justify-between group cursor-default transition-all duration-500 ease-out relative hover:border-white/25 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
            >
              <div>
                {/* Header with Issuer & Verify Action */}
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

                {/* Revealed Certificate Image on Hover with Rounded Top Corners & Bottom Attached to Details */}
                {cert.media && (
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-500 ease-out opacity-0 group-hover:opacity-100 overflow-hidden">
                    <div className="min-h-0 overflow-hidden">
                      <div className="w-full h-44 sm:h-48 rounded-t-xl rounded-b-none overflow-hidden border-t border-x border-white/[0.15] bg-zinc-950/90 relative">
                        <img
                          src={cert.media}
                          alt={cert.title}
                          className="w-full h-full object-cover rounded-t-xl rounded-b-none group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Panel — Moves Down on Hover & Joins Image into a Single Long Vertical Rectangle */}
                <div
                  className={`transition-all duration-500 ease-out ${
                    cert.media
                      ? 'group-hover:rounded-t-none group-hover:rounded-b-xl group-hover:border-b group-hover:border-x group-hover:border-white/[0.15] group-hover:bg-zinc-950/40 group-hover:p-4 group-hover:shadow-md'
                      : ''
                  }`}
                >
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors">
                    {cert.title}
                  </h3>
                </div>
              </div>

              {/* Skills Tags */}
              {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                <div className="pt-4 mt-2 border-t border-white/[0.06] flex flex-wrap gap-1.5">
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
          ))}
        </div>

      </div>
    </div>
  );
};