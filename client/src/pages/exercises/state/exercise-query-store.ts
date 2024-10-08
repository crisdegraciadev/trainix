import { ExerciseFilterDTO, OrderExerciseDTO } from '@/core/types';
import { create } from 'zustand';

type ExerciseQueryStore = {
  order: OrderExerciseDTO;
  setOrder: (order: OrderExerciseDTO) => void;
  filter: ExerciseFilterDTO;
  setFilter: (filter: ExerciseFilterDTO) => void;
};

export const useExerciseQueryStore = create<ExerciseQueryStore>((set) => ({
  order: { createdAt: 'desc' },
  setOrder: (order) => set((state) => ({ ...state, order })),
  filter: {},
  setFilter: (filter) => set((state) => ({ ...state, filter })),
}));
