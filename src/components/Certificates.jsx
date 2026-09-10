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
        
        {/* Section Header with Broad Distinct Separation Line */}
        <div className="mb-8 pb-6 border-b-2 border-white/20 shadow-[0_2px_12px_rgba(255,255,255,0.06)]">
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
              className="glass-card glass-panel-hover rounded-2xl border border-white/[0.08] hover:border-white/30 overflow-hidden flex flex-col justify-between group cursor-default transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)] relative"
            >
              <div>
                {/* Revealed Top Certificate Media on Hover with 0.4s hold delay */}
                {cert.media && (
                  <div className="max-h-0 opacity-0 group-hover:max-h-48 sm:group-hover:max-h-52 group-hover:opacity-100 transition-all duration-500 delay-[400ms] group-hover:duration-300 group-hover:delay-0 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden relative bg-zinc-950">
                    <img
                      src={cert.media}
                      alt={cert.title}
                      className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30" />
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

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors">
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
          ))}
        </div>

      </div>
    </div>
  );
};