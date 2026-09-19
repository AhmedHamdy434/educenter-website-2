import { create } from "zustand";

export interface SubscriptionState {
  warning: string | null;
  isExpired: boolean;
  setWarning: (warning: string | null) => void;
  setExpired: (isExpired: boolean) => void;
  clearWarning: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  warning: null,
  isExpired: false,
  setWarning: (warning) => set({ warning }),
  setExpired: (isExpired) => set({ isExpired }),
  clearWarning: () => set({ warning: null }),
}));
