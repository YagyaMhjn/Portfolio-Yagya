import React from 'react';

/**
 * Parses and renders text description with first-class support for bullet points,
 * multi-line paragraphs, and lists.
 */
export const ContentRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  // Split lines
  const rawLines = content.split('\n');

  // Check if line looks like a bullet
  const isBulletLine = (line) => {
    const trimmed = line.trim();
    return /^([•\-*]|\d+\.)\s+/.test(trimmed) || trimmed.startsWith('•') || trimmed.startsWith('-');
  };

  const hasBulletsOrMultipleLines = rawLines.some(line => isBulletLine(line)) || (rawLines.length > 1 && rawLines.some(l => l.trim().length > 0));

  // If text contains inline bullets like "• Point 1 • Point 2" without newlines
  if (!rawLines.some(isBulletLine) && content.includes('•')) {
    const inlineItems = content
      .split('•')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (inlineItems.length > 1) {
      return (
        <ul className={`space-y-2 mb-4 ${className}`}>
          {inlineItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal dark:font-light">
              <span className="shrink-0 text-amber-500 dark:text-amber-400 font-bold select-none text-xs mt-1">✦</span>
              <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
  }

  // If content has newline bullets or multi-line structure
  if (hasBulletsOrMultipleLines) {
    const items = [];
    rawLines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      // Strip leading bullet characters
      const cleanText = trimmed.replace(/^([•\-*]|\d+\.)\s*/, '').trim();
      if (cleanText) {
        items.push(cleanText);
      }
    });

    if (items.length > 1 || rawLines.some(isBulletLine)) {
      return (
        <ul className={`space-y-2 mb-4 ${className}`}>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal dark:font-light">
              <span className="shrink-0 text-amber-500 dark:text-amber-400 font-bold select-none text-xs mt-1">✦</span>
              <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
  }

  // Fallback to standard paragraph with whitespace pre-line
  return (
    <p className={`text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 leading-relaxed font-normal dark:font-light mb-4 whitespace-pre-line ${className}`}>
      {content}
    </p>
  );
};
