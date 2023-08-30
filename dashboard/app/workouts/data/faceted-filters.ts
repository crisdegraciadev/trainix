import { FaceTedFilterOptions } from "@/components/tables/data-table";
import { WorkoutConsts } from "../consts";

const { Cells, FacetedFilters } = WorkoutConsts.WorkoutTable;

export const FACETED_FILTERS: FaceTedFilterOptions[] = [
  {
    title: Cells.Difficulty.TITLE,
    accessorKey: Cells.Difficulty.ACCESSOR_KEY,
    options: [...FacetedFilters.Difficulty.OPTIONS],
  },
  {
    title: Cells.Category.TITLE,
    accessorKey: Cells.Category.ACCESSOR_KEY,
    options: [...FacetedFilters.Category.OPTIONS],
  },
  {
    title: Cells.MuscleGroups.TITLE,
    accessorKey: Cells.MuscleGroups.ACCESSOR_KEY,
    options: [...FacetedFilters.MuscleGroups.OPTIONS],
  },
];
