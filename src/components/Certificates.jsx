import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Search, Shield } from 'lucide-react';
import { SocialBar } from './SocialHandleButton';

export const Certificates = () => {
  const { data } = usePortfolio();
  const { certificates, profile } = data;
  const [searchQuery, setSearchQuery] = useState('');

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const filteredCerts = certificates.filter((cert) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const matchTitle = cert.title.toLowerCase().includes(query);
    const matchIssuer = cert.issuer.toLowerCase().includes(query);
    const matchSkills = Array.isArray(cert.skills) && cert.skills.some((s) => s.toLowerCase().includes(query));
    return matchTitle || matchIssuer || matchSkills;
  });

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Right-Corner Social Handles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 pb-6 border-b border-white/[0.06]">
          <div>
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

          {/* Right Corner Horizontal Social Handles */}
          <div className="shrink-0 flex items-center justify-start md:justify-end">
            <SocialBar socials={profile?.socials} />
          </div>
        </div>

          {/* Search bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search certificates, skills, or institutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9 pr-4 py-2 text-xs font-mono placeholder:text-zinc-500"
            />
          </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              onMouseMove={handleMouseMove}
              className="glass-card glass-panel-hover p-6 sm:p-7 rounded-2xl border border-white/[0.08] flex flex-col justify-between group cursor-default transition-all duration-300 relative"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
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

                {/* Upward Hover Pop-Up Certificate Media Preview */}
                {cert.media && (
                  <div className="relative mb-4.5 rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950/80 h-44 sm:h-48 w-full group/media transition-all duration-300 ease-out transform group-hover:-translate-y-3.5 group-hover:scale-[1.02] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(255,255,255,0.18)] group-hover:border-white/40 group-hover:ring-1 group-hover:ring-white/20 z-10">
                    <img
                      src={cert.media}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
                  </div>
                )}

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-zinc-100 transition-colors">
                  {cert.title}
                </h3>
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