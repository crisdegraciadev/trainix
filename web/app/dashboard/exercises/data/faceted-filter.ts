import { FaceTedFilterOptions } from "@/components/tables/data-table";
import { ExerciseConsts } from "../consts";

const { Cells, FacetedFilters } = ExerciseConsts.ExerciseTable;

export const FACETED_FILTERS: FaceTedFilterOptions[] = [
  {
    title: Cells.Difficulty.TITLE,
    accessorKey: Cells.Difficulty.ACCESSOR_KEY,
    options: [...FacetedFilters.Difficulty.OPTIONS],
  },
  {
    title: Cells.MuscleGroups.TITLE,
    accessorKey: Cells.MuscleGroups.ACCESSOR_KEY,
    options: [...FacetedFilters.MuscleGroups.OPTIONS],
  },
];
