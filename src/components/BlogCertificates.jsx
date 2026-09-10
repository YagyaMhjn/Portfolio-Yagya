import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { BookOpen, Award, Trophy, ArrowRight, ExternalLink } from 'lucide-react';

export const BlogCertificates = () => {
  const { data } = usePortfolio();
  const { blog, hackathons, certificates } = data;
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <section id="blog" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-4">
            <span>✦</span> INSIGHTS & HONORS <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Articles & Credentials
          </h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-lg mx-auto">
            Deep-dive architectural essays, hackathon sprint builds, and verified technical credentials.
          </p>
        </div>

        {/* 1. Blog Articles Grid */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={16} className="text-zinc-400" />
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Technical Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blog.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedArticle(post)}
                className="glass-card glass-panel-hover p-6 rounded-2xl border border-white/[0.08] cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3">
                    <span>{post.date}</span>
                    <span>{post.readTime || '4 min read'}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-3 group-hover:text-zinc-200 transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
                    {post.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs font-medium text-zinc-300 group-hover:text-white">
                  <span className="font-mono text-[10px] text-zinc-400">{post.tags}</span>
                  <span className="flex items-center gap-1 text-xs">
                    Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Hackathons & Competitions */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={16} className="text-zinc-400" />
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Hackathons & Rapid Builds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hackathons.map((hack) => (
              <div
                key={hack.id}
                className="glass-card glass-panel-hover p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[10px] font-mono text-zinc-200 mb-3">
                    <Trophy size={10} className="text-zinc-300" />
                    <span>{hack.award}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{hack.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">{hack.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Verified Certificates */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Award size={16} className="text-zinc-400" />
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Verified Certificates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass-card glass-panel-hover p-5 rounded-xl border border-white/[0.07] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-zinc-400">{cert.issuer} • {cert.date}</div>
                  <div className="text-sm font-bold text-white mt-1">{cert.title}</div>
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/[0.08]"
                    title="Verify Certificate"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-zinc-400">{selectedArticle.date} • {selectedArticle.readTime}</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-2 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white"
              >
                Close ✕
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{selectedArticle.title}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-light">{selectedArticle.summary}</p>
            <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.06] text-xs font-mono text-zinc-400 leading-relaxed">
              Full article body is available in the engineering documentation repository. Topics: {selectedArticle.tags}.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
