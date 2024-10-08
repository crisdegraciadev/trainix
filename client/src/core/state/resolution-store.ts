import { create } from 'zustand';

type ExerciseStore = {
  isDesktop: boolean;
  setIsDesktop: (value: boolean) => void;
};

export const useResolutionStore = create<ExerciseStore>((set) => ({
  isDesktop: true,
  setIsDesktop: (isDesktop) => set((state) => ({ ...state, isDesktop })),
}));
