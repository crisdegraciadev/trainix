import { FilterExercisesDTO, OrderExercisesDTO } from '@/core/types';
import { create } from 'zustand';

type ExerciseQueryStore = {
  order: OrderExercisesDTO;
  setOrder: (order: OrderExercisesDTO) => void;
  filter: FilterExercisesDTO;
  setFilter: (filter: FilterExercisesDTO) => void;
};

export const useExerciseQueryStore = create<ExerciseQueryStore>((set) => ({
  order: { createdAt: 'desc' },
  setOrder: (order) => set((state) => ({ ...state, order })),
  filter: {},
  setFilter: (filter) => set((state) => ({ ...state, filter })),
}));
