import { create } from 'zustand';
import { ChatMessage } from '../types/chat';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;

  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearHistory: () => set({ messages: [], isLoading: false }),
}));
