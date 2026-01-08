import { create } from 'zustand';

export type HighlightTarget =
  | { type: 'header' }
  | { type: 'experience'; id?: string }
  | { type: 'education'; id?: string }
  | { type: 'skills' }
  | { type: 'custom'; sectionId: string; itemId?: string }
  | { type: 'styling' }
  | { type: 'profile-image' };

interface HighlightStore {
  highlights: Map<string, number>;
  addHighlight: (target: HighlightTarget) => void;
  removeHighlight: (key: string) => void;
  isHighlighted: (key: string) => boolean;
  clearAll: () => void;
}

const targetToKey = (target: HighlightTarget): string => {
  switch (target.type) {
    case 'header':
      return 'header';
    case 'profile-image':
      return 'profile-image';
    case 'skills':
      return 'skills';
    case 'styling':
      return 'styling';
    case 'experience':
      return target.id ? `experience-${target.id}` : 'experience';
    case 'education':
      return target.id ? `education-${target.id}` : 'education';
    case 'custom':
      return target.itemId
        ? `custom-${target.sectionId}-${target.itemId}`
        : `custom-${target.sectionId}`;
  }
};

export const useHighlightStore = create<HighlightStore>((set, get) => ({
  highlights: new Map(),

  addHighlight: (target) => {
    const key = targetToKey(target);
    const timestamp = Date.now();

    set((state) => {
      const newHighlights = new Map(state.highlights);
      newHighlights.set(key, timestamp);
      return { highlights: newHighlights };
    });
  },

  removeHighlight: (key) => {
    set((state) => {
      const newHighlights = new Map(state.highlights);
      newHighlights.delete(key);
      return { highlights: newHighlights };
    });
  },

  isHighlighted: (key) => {
    return get().highlights.has(key);
  },

  clearAll: () => {
    set({ highlights: new Map() });
  },
}));
