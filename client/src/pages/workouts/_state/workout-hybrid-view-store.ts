import { create } from "zustand";

type WorkoutHybridViewStore = {
  formOpen: boolean;
  setFormOpen: (value: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (value: boolean) => void;
  orderOpen: boolean;
  setOrderOpen: (value: boolean) => void;
  detailsOpen: { [id: string]: boolean };
  setDetailsOpen: (value: { [id: string]: boolean }) => void;
};

export const useWorkoutHybridViewStore = create<WorkoutHybridViewStore>((set) => ({
  formOpen: false,
  setFormOpen: (formOpen) => set((state) => ({ ...state, formOpen })),
  filterOpen: false,
  setFilterOpen: (filterOpen) => set((state) => ({ ...state, filterOpen })),
  orderOpen: false,
  setOrderOpen: (orderOpen) => set((state) => ({ ...state, orderOpen })),
  detailsOpen: {},
  setDetailsOpen: (detailsOpen) => set((state) => ({ ...state, detailsOpen })),
}));
