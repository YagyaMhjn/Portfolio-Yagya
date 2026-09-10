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

/**
 * Horizontal Social Button for Hero and section headers.
 * Fixed dimensions (w-11 h-11) guarantee ZERO layout thrashing when dashing cursor through.
 * Floating tooltip displays label above without shifting sibling buttons.
 */
export const HorizontalSocialButton = ({ social, className = "" }) => {
  if (!social || !social.url) return null;

  const label = social.label || social.platform || 'Link';
  const isEmail = social.url.startsWith('mailto:') || social.platform?.toLowerCase().includes('email');
  const href = isEmail && !social.url.startsWith('mailto:') ? `mailto:${social.url}` : social.url;
  const isDownload = social.platform?.toLowerCase().includes('cv') || social.platform?.toLowerCase().includes('resume');

  return (
    <div className="relative group inline-flex items-center justify-center">
      <a
        href={href}
        target={isEmail ? '_self' : '_blank'}
        rel="noopener noreferrer"
        download={isDownload && !href.startsWith('http') ? 'Yagya_Mahajan_Resume.pdf' : undefined}
        aria-label={label}
        className={`flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white border border-white/10 dark:border-white/10 light:border-black/15 text-zinc-300 dark:text-zinc-300 light:text-zinc-800 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 hover:border-white/30 dark:hover:border-white/30 light:hover:border-black/35 hover:-translate-y-1 hover:scale-105 transition-all duration-200 ease-out cursor-pointer select-none shadow-md hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-md will-change-transform ${className}`}
      >
        <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          {getSocialIcon(social.platform, 16)}
        </span>
      </a>

      {/* Floating High-Contrast Tooltip (Positioned above, zero impact on document flow) */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 ease-out z-50 flex flex-col items-center">
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium whitespace-nowrap bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white text-white dark:text-white light:text-black border border-white/20 dark:border-white/20 light:border-black/20 shadow-xl">
          {label}
        </span>
        <span className="w-1.5 h-1.5 bg-zinc-950 dark:bg-zinc-950 light:bg-white border-r border-b border-white/20 dark:border-white/20 light:border-black/20 transform rotate-45 -mt-1" />
      </div>
    </div>
  );
};

/**
 * Universal Social Handle Button (Supports both left-expanding vertical dock and fixed horizontal)
 */
export const SocialHandleButton = ({ social, className = "", align = "left" }) => {
  if (align === "left") {
    return <HorizontalSocialButton social={social} className={className} />;
  }

  // Vertical Stack Button (Expands horizontally to the left on separate rows without layout shifts)
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
      aria-label={label}
      className={`inline-flex items-center justify-center h-11 min-w-[44px] px-3.5 rounded-xl bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100 border border-white/10 dark:border-white/10 light:border-black/15 hover:border-white/30 dark:hover:border-white/30 light:hover:border-black/35 text-zinc-300 dark:text-zinc-300 light:text-zinc-800 hover:text-white dark:hover:text-white light:hover:text-black transition-all duration-300 ease-out group overflow-hidden shadow-lg hover:shadow-[0_0_22px_rgba(255,255,255,0.18)] dark:hover:shadow-[0_0_22px_rgba(255,255,255,0.18)] light:hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] cursor-pointer select-none backdrop-blur-md will-change-transform ${className}`}
    >
      {/* Label expanding to the left */}
      <span className="max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:mr-2.5 transition-all duration-300 ease-out whitespace-nowrap text-xs font-mono font-medium tracking-wide">
        {label}
      </span>
      {/* Icon (Anchored on right corner) */}
      <span className="shrink-0 flex items-center justify-center text-zinc-300 dark:text-zinc-300 light:text-zinc-800 group-hover:text-white dark:group-hover:text-white light:group-hover:text-black group-hover:scale-110 transition-transform duration-300">
        {getSocialIcon(social.platform, 16)}
      </span>
    </a>
  );
};

export const SocialBar = ({ socials = [], className = "" }) => {
  if (!socials || socials.length === 0) return null;
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {socials.map((soc, idx) => (
        <HorizontalSocialButton key={soc.id || idx} social={soc} />
      ))}
    </div>
  );
};

export const VerticalSocialDock = ({ socials = [], className = "" }) => {
  if (!socials || socials.length === 0) return null;
  return (
    <aside
      aria-label="Social Profiles"
      className={`fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto animate-fadeIn ${className}`}
    >
      {socials.map((soc, idx) => (
        <SocialHandleButton key={soc.id || idx} social={soc} align="right" />
      ))}
    </aside>
  );
};