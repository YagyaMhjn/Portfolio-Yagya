import React, { useState, useRef, useEffect } from 'react';
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
 * - On hover intent: Smoothly and flowingly expands horizontally, revealing the platform name beside the icon.
 * - Hardware-accelerated, zero lag, zero layout jitter.
 * - Controlled via hover-intent to prevent chaotic multi-expansion during fast cursor sweeps.
 */
export const SocialHandleButton = ({
  social,
  className = "",
  align = "left",
  isExpanded: controlledExpanded,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!social || !social.url) return null;

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : uncontrolledExpanded;

  const label = social.label || social.platform || 'Link';
  const isEmail = social.url.startsWith('mailto:') || social.platform?.toLowerCase().includes('email');
  const href = isEmail && !social.url.startsWith('mailto:') ? `mailto:${social.url}` : social.url;
  const isDownload = social.platform?.toLowerCase().includes('cv') || social.platform?.toLowerCase().includes('resume');

  const isRightAligned = align === 'right';

  const handleMouseEnter = (e) => {
    if (!isControlled) {
      setUncontrolledExpanded(true);
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    if (!isControlled) {
      setUncontrolledExpanded(false);
    }
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <a
      href={href}
      target={isEmail ? '_self' : '_blank'}
      rel="noopener noreferrer"
      download={isDownload && !href.startsWith('http') ? 'Yagya_Mahajan_Resume.pdf' : undefined}
      title={label}
      aria-label={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`social-expanding-btn group relative inline-flex items-center shrink-0 h-11 px-3 rounded-xl bg-[#121215] border border-white/10 text-zinc-300 hover:text-white shadow-md hover:shadow-xl cursor-pointer select-none overflow-hidden ${
        isExpanded ? 'is-expanded' : ''
      } ${className}`}
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
          <span className={`shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-out ${isExpanded ? 'scale-110' : 'group-hover:scale-105'}`}>
            {getSocialIcon(social.platform, 16)}
          </span>
        </>
      ) : (
        <>
          {/* Icon (Anchored on left for horizontal bar) */}
          <span className={`shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-out ${isExpanded ? 'scale-110' : 'group-hover:scale-105'}`}>
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
  const [activeId, setActiveId] = useState(null);
  const intentTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    };
  }, []);

  if (!socials || socials.length === 0) return null;

  const handleMouseEnter = (id) => {
    if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    // 65ms hover-intent: fast cursor dashing passes in ~15-30ms, cancelling expansion.
    // Deliberate hovering triggers instant smooth expansion.
    intentTimerRef.current = setTimeout(() => {
      setActiveId(id);
    }, 65);
  };

  const handleMouseLeave = (id) => {
    if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    setActiveId((prev) => (prev === id ? null : prev));
  };

  const handleBarMouseLeave = () => {
    if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    setActiveId(null);
  };

  return (
    <div
      onMouseLeave={handleBarMouseLeave}
      className={`flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0 ${className}`}
    >
      {socials.map((soc, idx) => {
        const id = soc.id || `soc-${idx}-${soc.platform}`;
        return (
          <SocialHandleButton
            key={id}
            social={soc}
            align="left"
            isExpanded={activeId === id}
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={() => handleMouseLeave(id)}
          />
        );
      })}
    </div>
  );
};

export const VerticalSocialDock = ({ socials = [], className = "" }) => {
  const [activeId, setActiveId] = useState(null);
  const intentTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    };
  }, []);

  if (!socials || socials.length === 0) return null;

  const handleMouseEnter = (id) => {
    if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    intentTimerRef.current = setTimeout(() => {
      setActiveId(id);
    }, 65);
  };

  const handleMouseLeave = (id) => {
    if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    setActiveId((prev) => (prev === id ? null : prev));
  };

  const handleDockMouseLeave = () => {
    if (intentTimerRef.current) clearTimeout(intentTimerRef.current);
    setActiveId(null);
  };

  return (
    <aside
      aria-label="Social Profiles"
      onMouseLeave={handleDockMouseLeave}
      className={`fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-auto animate-fadeIn ${className}`}
    >
      {socials.map((soc, idx) => {
        const id = soc.id || `vert-soc-${idx}-${soc.platform}`;
        return (
          <SocialHandleButton
            key={id}
            social={soc}
            align="right"
            isExpanded={activeId === id}
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={() => handleMouseLeave(id)}
          />
        );
      })}
    </aside>
  );
};