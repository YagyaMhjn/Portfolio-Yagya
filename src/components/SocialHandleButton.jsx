import React from 'react';
import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  TwitterIcon,
  MailIcon,
  DownloadIcon,
  YoutubeIcon,
  DiscordIcon,
  GlobeIcon,
} from './Icons';

export const getSocialIcon = (platform, size = 16, className = "") => {
  const p = (platform || '').toLowerCase();
  if (p.includes('git')) return <GithubIcon size={size} className={className} />;
  if (p.includes('link')) return <LinkedinIcon size={size} className={className} />;
  if (p.includes('insta')) return <InstagramIcon size={size} className={className} />;
  if (p.includes('twit') || p.includes('x ') || p === 'x') return <TwitterIcon size={size} className={className} />;
  if (p.includes('mail') || p.includes('email')) return <MailIcon size={size} className={className} />;
  if (p.includes('cv') || p.includes('resume') || p.includes('down')) return <DownloadIcon size={size} className={className} />;
  if (p.includes('you') || p.includes('yt')) return <YoutubeIcon size={size} className={className} />;
  if (p.includes('disc')) return <DiscordIcon size={size} className={className} />;
  return <GlobeIcon size={size} className={className} />;
};

export const SocialHandleButton = ({ social, className = "" }) => {
  if (!social || !social.url) return null;

  const label = social.label || social.platform || 'Link';
  const isEmail = social.url.startsWith('mailto:') || social.platform?.toLowerCase().includes('email');
  const href = isEmail && !social.url.startsWith('mailto:') ? `mailto:${social.url}` : social.url;
  const isDownload = social.platform?.toLowerCase().includes('cv') || social.platform?.toLowerCase().includes('resume');

  return (
    <a
      href={href}
      target={isEmail ? '_self' : '_blank'}
      rel="noopener noreferrer"
      download={isDownload && !href.startsWith('http') ? 'Yagya_Mahajan_Resume.pdf' : undefined}
      title={label}
      className={`inline-flex items-center justify-center h-11 min-w-[44px] px-3.5 rounded-xl bg-[#111114]/90 hover:bg-[#1b1b20] border border-white/[0.12] hover:border-white/40 text-zinc-300 hover:text-white transition-all duration-300 ease-out group overflow-hidden shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] cursor-pointer select-none ${className}`}
    >
      {/* Icon (static square) */}
      <span className="shrink-0 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:scale-110 transition-transform duration-300">
        {getSocialIcon(social.platform, 16)}
      </span>
      {/* Expanding Label (reveals name on hover, smoothly expanding button width) */}
      <span className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-300 ease-out whitespace-nowrap text-xs font-mono font-medium tracking-wide">
        {label}
      </span>
    </a>
  );
};

export const SocialBar = ({ socials = [], className = "" }) => {
  if (!socials || socials.length === 0) return null;
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {socials.map((soc, idx) => (
        <SocialHandleButton key={soc.id || idx} social={soc} />
      ))}
    </div>
  );
};