import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, ExternalLink, Search, CheckCircle2, Shield } from 'lucide-react';

export const Certificates = () => {
  const { data } = usePortfolio();
  const { certificates } = data;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCerts = certificates.filter((cert) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const matchTitle = cert.title.toLowerCase().includes(query);
    const matchIssuer = cert.issuer.toLowerCase().includes(query);
    const matchSkills = Array.isArray(cert.skills) && cert.skills.some((s) => s.toLowerCase().includes(query));
    return matchTitle || matchIssuer || matchSkills;
  });

  return (
    <section id="certificates" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-4">
            <span>✦</span> VERIFIED CREDENTIALS <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certificates & Accreditations
          </h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto">
            Professional certifications, specialized specializations, and verified technical honors.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search certificates, skills, or institutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9 pr-4 py-2 text-xs font-mono placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="glass-card glass-panel-hover p-6 sm:p-7 rounded-2xl border border-white/[0.08] flex flex-col justify-between group"
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
                      className="p-1.5 rounded-lg bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/[0.08] transition-colors flex items-center gap-1 text-[11px] font-mono"
                      title="Verify Certificate"
                    >
                      <span>Verify</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-zinc-200 transition-colors">
                  {cert.title}
                </h3>
              </div>

              {/* Skills Tags */}
              {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                <div className="pt-4 mt-2 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                  {cert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-zinc-900/90 text-zinc-300 text-[10px] font-mono border border-white/[0.05]"
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
    </section>
  );
};