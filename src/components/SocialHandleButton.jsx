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
 * Smooth, flowy expanding social handle button.
 * - At rest: Neat 44x44 rounded square showing only the platform icon.
 * - On hover: Smoothly and flowingly expands horizontally, revealing the platform name beside the icon.
 * - Hardware-accelerated, zero lag, zero layout jitter.
 */
export const SocialHandleButton = ({ social, className = "", align = "left" }) => {
  if (!social || !social.url) return null;

  const label = social.label || social.platform || 'Link';
  const isEmail = social.url.startsWith('mailto:') || social.platform?.toLowerCase().includes('email');
  const href = isEmail && !social.url.startsWith('mailto:') ? `mailto:${social.url}` : social.url;
  const isDownload = social.platform?.toLowerCase().includes('cv') || social.platform?.toLowerCase().includes('resume');

  const isRightAligned = align === 'right';

  return (
    <a
      href={href}
      target={isEmail ? '_self' : '_blank'}
      rel="noopener noreferrer"
      download={isDownload && !href.startsWith('http') ? 'Yagya_Mahajan_Resume.pdf' : undefined}
      title={label}
      aria-label={label}
      className={`social-expanding-btn group relative inline-flex items-center shrink-0 h-11 px-3 rounded-xl bg-[#121215] border border-white/10 hover:border-white/35 text-zinc-300 hover:text-white hover:bg-[#1c1c22] shadow-md hover:shadow-xl cursor-pointer select-none overflow-hidden ${className}`}
    >
      {isRightAligned ? (
        <>
          {/* Label expanding to the left (for vertical dock on right side of screen) */}
          <span className="social-expanding-label text-xs font-mono font-medium tracking-wide">
            <span className="pr-2.5 inline-block whitespace-nowrap">
              {label}
            </span>
          </span>
          {/* Icon (Anchored on right) */}
          <span className="shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
            {getSocialIcon(social.platform, 16)}
          </span>
        </>
      ) : (
        <>
          {/* Icon (Anchored on left for horizontal bar) */}
          <span className="shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
            {getSocialIcon(social.platform, 16)}
          </span>
          {/* Label expanding to the right */}
          <span className="social-expanding-label text-xs font-mono font-medium tracking-wide">
            <span className="pl-2.5 inline-block whitespace-nowrap">
              {label}
            </span>
          </span>
        </>
      )}
    </a>
  );
};

export const SocialBar = ({ socials = [], className = "" }) => {
  if (!socials || socials.length === 0) return null;
  return (
    <div className={`flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0 ${className}`}>
      {socials.map((soc, idx) => (
        <SocialHandleButton key={soc.id || idx} social={soc} align="left" />
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