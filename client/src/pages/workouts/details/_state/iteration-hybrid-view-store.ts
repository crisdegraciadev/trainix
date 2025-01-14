import { create } from "zustand";

type IterationHybridViewStore = {
  formOpen: boolean;
  setFormOpen: (value: boolean) => void;
};

export const useIterationHybridViewStore = create<IterationHybridViewStore>((set) => ({
  formOpen: false,
  setFormOpen: (formOpen) => set((state) => ({ ...state, formOpen })),
}));
