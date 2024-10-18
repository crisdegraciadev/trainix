import { FilterWorkoutsDTO, OrderWorkoutsDTO } from "@/core/types";
import { create } from "zustand";

type WorkoutQueryStore = {
  order: OrderWorkoutsDTO;
  setOrder: (order: OrderWorkoutsDTO) => void;
  filter: FilterWorkoutsDTO;
  setFilter: (filter: FilterWorkoutsDTO) => void;
};

export const useWorkoutQueryStore = create<WorkoutQueryStore>((set) => ({
  order: { createdAt: "desc" },
  setOrder: (order) => set((state) => ({ ...state, order })),
  filter: {},
  setFilter: (filter) => set((state) => ({ ...state, filter })),
}));
