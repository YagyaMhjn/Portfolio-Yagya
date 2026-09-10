import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { SocialBar } from './SocialHandleButton';
import confetti from 'canvas-confetti';

export const Contact = () => {
  const { data, addMessage } = usePortfolio();
  const { profile } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    addMessage(formData);
    setSubmitted(true);
    setError('');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ffffff', '#a1a1aa', '#52525b', '#e4e4e7'],
      });
    } catch (e) {}

    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-16 relative animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Broad Distinct Separation Line */}
        <div className="mb-8 pb-6 border-b-2 border-white/20 shadow-[0_2px_12px_rgba(255,255,255,0.06)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono tracking-widest uppercase text-zinc-400 mb-2.5 shadow-[0_0_12px_rgba(255,255,255,0.02)]">
            <span>✦</span> INITIATE COMMUNICATION <span>✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get in Touch
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 max-w-lg">
            Have a project in mind, an engineering opportunity, or wish to connect? Send a message and I'll respond promptly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08] space-y-6">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                Direct Channels
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] hover:bg-zinc-800/80 hover:border-white/20 transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-black/50 text-zinc-300 group-hover:text-white border border-white/[0.06]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400">Email Address</div>
                    <div className="text-sm font-semibold text-white">{profile.email}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                  <div className="p-2.5 rounded-lg bg-black/50 text-zinc-300 border border-white/[0.06]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400">Location</div>
                    <div className="text-sm font-semibold text-white">{profile.location}</div>
                  </div>
                </div>

                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] hover:bg-zinc-800/80 hover:border-white/20 transition-all group"
                  >
                    <div className="p-2.5 rounded-lg bg-black/50 text-zinc-300 group-hover:text-white border border-white/[0.06]">
                      <LinkedinIcon size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-zinc-400">LinkedIn Profile</div>
                      <div className="text-sm font-semibold text-white">linkedin.com/in/yagya-mahajan</div>
                    </div>
                  </a>
                )}

                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] hover:bg-zinc-800/80 hover:border-white/20 transition-all group"
                  >
                    <div className="p-2.5 rounded-lg bg-black/50 text-zinc-300 group-hover:text-white border border-white/[0.06]">
                      <GithubIcon size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-zinc-400">GitHub Profile</div>
                      <div className="text-sm font-semibold text-white">github.com/YagyaMhjn</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider mb-6 flex items-center gap-2">
                <MessageSquare size={16} className="text-zinc-400" /> Send a Message
              </h3>

              {submitted ? (
                <div className="p-8 text-center bg-zinc-950/80 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">Message Dispatched</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Thank you for reaching out. Your transmission has been recorded in the system and I will respond promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="glass-input w-full px-4 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="glass-input w-full px-4 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Let's build something exceptional..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="glass-input w-full px-4 py-2.5 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10"
                  >
                    <Send size={14} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};