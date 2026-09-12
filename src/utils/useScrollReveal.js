import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for continuous, scroll-responsive reveal and tuck-in of project/certificate media
 * on mobile and tablet devices (< 1024px).
 *
 * Behavior:
 * - As a panel approaches the center of the screen, a percentage of the image reveals
 *   with a shadow overlay simulating it emerging from behind the panel.
 * - When the panel is centered in the screen, the image is 100% fully revealed with NO shadow.
 * - As the panel moves above the center, the image progressively tucks back into the panel
 *   in direct response to scrolling, with the shadow reappearing.
 * - Simultaneously, the panel below begins emerging.
 * - On Laptop / Desktop (>= 1024px), cursor hover interaction is preserved.
 */
export const useScrollReveal = (items = []) => {
  const cardsData = useRef(new Map());

  const registerCard = useCallback((id, el, ratio = 'original') => {
    if (!el) {
      cardsData.current.delete(id);
      return;
    }

    const mediaWrapperEl = el.querySelector('.scroll-reveal-media');
    const mediaInnerEl = el.querySelector('.scroll-reveal-inner');
    const shadowOverlayEl = el.querySelector('.scroll-reveal-shadow');
    const imgEl = el.querySelector('.scroll-reveal-img');

    cardsData.current.set(id, {
      cardEl: el,
      mediaWrapperEl,
      mediaInnerEl,
      shadowOverlayEl,
      imgEl,
      ratio: ratio || 'original',
    });
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateScrollReveal = () => {
      const isMobile = window.innerWidth < 1024;

      if (!isMobile) {
        // Reset styles for desktop so CSS hover operates cleanly
        for (const data of cardsData.current.values()) {
          if (!data) continue;
          const { cardEl, mediaWrapperEl, mediaInnerEl, shadowOverlayEl } = data;
          if (mediaWrapperEl) {
            mediaWrapperEl.style.height = '';
          }
          if (mediaInnerEl) {
            mediaInnerEl.style.transform = '';
          }
          if (shadowOverlayEl) {
            shadowOverlayEl.style.opacity = '';
          }
          if (cardEl) {
            cardEl.classList.remove('border-white/25');
          }
        }
        ticking = false;
        return;
      }

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      // Transition range around viewport center (span of ~280px-320px above and below center)
      const W = Math.min(viewportHeight * 0.44, 320);

      for (const data of cardsData.current.values()) {
        if (!data || !data.cardEl || !data.mediaWrapperEl) continue;
        const { cardEl, mediaWrapperEl, mediaInnerEl, shadowOverlayEl, imgEl, ratio } = data;

        const rect = cardEl.getBoundingClientRect();

        // Card width on mobile
        const cardWidth = rect.width || (window.innerWidth - 48);

        // Calculate target full height based on aspect ratio
        let targetHeight = 220;
        if (ratio === '16/9') {
          targetHeight = Math.round(cardWidth * (9 / 16));
        } else if (ratio === '4/3') {
          targetHeight = Math.round(cardWidth * (3 / 4));
        } else if (ratio === '1/1') {
          targetHeight = Math.round(Math.min(cardWidth, 300));
        } else {
          if (imgEl && imgEl.naturalWidth && imgEl.naturalHeight) {
            const naturalAspect = imgEl.naturalHeight / imgEl.naturalWidth;
            targetHeight = Math.round(Math.min(cardWidth * naturalAspect, 360));
          } else {
            targetHeight = Math.round(cardWidth * 0.62);
          }
        }

        // If card is far off-screen, keep it tucked in
        if (rect.bottom < -120 || rect.top > viewportHeight + 120) {
          mediaWrapperEl.style.height = '0px';
          if (shadowOverlayEl) shadowOverlayEl.style.opacity = '1';
          if (mediaInnerEl) mediaInnerEl.style.transform = 'translateY(-20px) scale(0.94)';
          continue;
        }

        // Reference center of the card when fully revealed (monotonic with rect.top, no feedback loop)
        const estimatedCardCenter = rect.top + (targetHeight / 2) + 100;
        const D = Math.abs(estimatedCardCenter - viewportCenter);

        let progress = 0;
        if (D < W) {
          const r = Math.max(0, 1 - D / W);
          // Smoothstep easing: S-curve transition that is slow at the ends and smooth in the middle
          progress = r * r * (3 - 2 * r);
        }

        // 1. Reveal height proportional to scroll (0 to targetHeight)
        const currentHeight = Math.round(progress * targetHeight);
        mediaWrapperEl.style.height = `${currentHeight}px`;

        // 2. Shadow effect: 1 (full dark shadow) when tucked away, 0 (no shadow) when centered
        if (shadowOverlayEl) {
          const shadowOpacity = Math.max(0, Math.min(1, Math.pow(1 - progress, 1.25)));
          shadowOverlayEl.style.opacity = shadowOpacity.toFixed(3);
        }

        // 3. Subtle parallax slide & scale: emerges from behind panel into view
        if (mediaInnerEl) {
          const translateY = (1 - progress) * -20;
          const scale = 0.94 + 0.06 * progress;
          mediaInnerEl.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        }

        // 4. Subtle border highlight when centered
        if (cardEl) {
          if (progress > 0.65) {
            cardEl.classList.add('border-white/25');
          } else {
            cardEl.classList.remove('border-white/25');
          }
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollReveal);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial passes to handle immediate viewport placement
    updateScrollReveal();
    const timer = setTimeout(updateScrollReveal, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return { registerCard };
};
