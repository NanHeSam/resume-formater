import { useEffect } from 'react';
import { useHighlightStore } from '../store/highlightStore';

const ANIMATION_DURATION = 800; // ms

export const useHighlight = (key: string): boolean => {
  const timestamp = useHighlightStore((state) => state.highlights.get(key));
  const removeHighlight = useHighlightStore((state) => state.removeHighlight);

  const isHighlighted = timestamp !== undefined;

  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        removeHighlight(key);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [timestamp, key, removeHighlight, isHighlighted]);

  return isHighlighted;
};
