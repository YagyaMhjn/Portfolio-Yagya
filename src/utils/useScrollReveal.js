import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to dynamically reveal images on cards as they approach the center of the screen
 * during scrolling on mobile and tablet devices (< 1024px width).
 *
 * When a card approaches the vertical center of the viewport, its media expands.
 * As the user scrolls past and the card moves above the center, its media smoothly retracts,
 * while the next card below begins revealing its media as it nears the center.
 *
 * Desktop / Laptop (>= 1024px) retains its standard cursor hover interaction.
 */
export const useScrollReveal = (items = []) => {
  const cardRefs = useRef({});
  const [activeCardIds, setActiveCardIds] = useState(new Set());
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });

  // Track responsive breakpoint for mobile / tablet (< 1024px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Register / unregister card DOM elements
  const registerCardRef = useCallback((id, el) => {
    if (el) {
      cardRefs.current[id] = el;
    } else {
      delete cardRefs.current[id];
    }
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setActiveCardIds(new Set());
      return;
    }

    let ticking = false;

    const calculateActiveCards = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      const entries = Object.entries(cardRefs.current);
      if (entries.length === 0) {
        ticking = false;
        return;
      }

      let closestId = null;
      let minDistance = Infinity;

      for (const [id, el] of entries) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        // Must be somewhat visible in viewport
        if (rect.bottom < 40 || rect.top > viewportHeight - 40) continue;

        // Use top + fixed offset so measurement is immune to height changes from media expanding
        const cardRefPoint = rect.top + Math.min(rect.height / 2, 180);
        const dist = Math.abs(cardRefPoint - viewportCenter);

        if (dist < minDistance) {
          minDistance = dist;
          closestId = id;
        }
      }

      // Check if closest card is within center focus threshold (within 48% of viewport height)
      if (closestId && minDistance < viewportHeight * 0.48) {
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const newActive = new Set();

        if (isTablet) {
          const closestEl = cardRefs.current[closestId];
          const closestRect = closestEl?.getBoundingClientRect();
          for (const [id, el] of entries) {
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            // Activate both cards in the same horizontal row on tablet
            if (Math.abs(rect.top - (closestRect?.top || 0)) < 70) {
              newActive.add(id);
            }
          }
        } else {
          newActive.add(closestId);
        }

        setActiveCardIds(newActive);
      } else {
        setActiveCardIds(new Set());
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateActiveCards);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check on mount or when items change
    calculateActiveCards();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile, items]);

  const isCardActive = useCallback(
    (id) => {
      return isMobile && activeCardIds.has(id);
    },
    [isMobile, activeCardIds]
  );

  return { registerCardRef, isCardActive, isMobile };
};
