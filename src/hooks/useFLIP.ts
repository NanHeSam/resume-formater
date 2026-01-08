import { useEffect, useRef } from 'react';

/**
 * useFLIP - Hook for FLIP (First-Last-Invert-Play) animations
 * Animates element positions when they change in the DOM
 */
export const useFLIP = (dependencies: any[]) => {
  const elementsRef = useRef<Map<string, DOMRect>>(new Map());

  useEffect(() => {
    // Record FIRST positions before React updates
    const recordFirst = () => {
      elementsRef.current.clear();
    };

    recordFirst();
  }, dependencies);

  const animate = (elements: HTMLElement[], keys: string[]) => {
    if (elements.length === 0) return;

    // 1. FIRST: Get initial positions (already recorded in previous render)
    const firstPositions = new Map<string, DOMRect>();
    keys.forEach((key, i) => {
      const rect = elementsRef.current.get(key);
      if (rect && elements[i]) {
        firstPositions.set(key, rect);
      }
    });

    // 2. LAST: Get final positions (after DOM update)
    const lastPositions = new Map<string, DOMRect>();
    elements.forEach((el, i) => {
      if (el) {
        lastPositions.set(keys[i], el.getBoundingClientRect());
        // Store for next animation
        elementsRef.current.set(keys[i], el.getBoundingClientRect());
      }
    });

    // 3. INVERT: Calculate deltas and apply negative transforms
    elements.forEach((el, i) => {
      const key = keys[i];
      const first = firstPositions.get(key);
      const last = lastPositions.get(key);

      if (first && last && el) {
        const deltaY = first.top - last.top;
        const deltaX = first.left - last.left;

        if (deltaY !== 0 || deltaX !== 0) {
          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          el.style.transition = 'none';
        }
      }
    });

    // 4. PLAY: Animate to natural position
    requestAnimationFrame(() => {
      elements.forEach((el) => {
        if (el) {
          el.style.transition = 'transform 500ms ease-out';
          el.style.transform = 'translate(0, 0)';
        }
      });

      // Clean up transition after animation completes
      setTimeout(() => {
        elements.forEach((el) => {
          if (el) {
            el.style.transition = '';
            el.style.transform = '';
          }
        });
      }, 500);
    });
  };

  return { animate };
};
