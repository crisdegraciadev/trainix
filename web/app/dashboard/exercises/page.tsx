"use client";

import { DataTable } from "../../../components/tables/data-table";
import { EXERCISES_COLUMNS } from "./components/tables/columns";
import { WorkoutCreateFormDialog } from "../workouts/components/forms/create";
import { useFetchExercises } from "./hooks/useFetchExercises";
import { FACETED_FILTERS } from "./data/faceted-filter";

export default function ExercisesPage() {
  const { data } = useFetchExercises();

  return (
    <section className="mt-1">
      <DataTable
        columns={EXERCISES_COLUMNS}
        createFormDialog={<WorkoutCreateFormDialog />}
        searchBarPlaceholder="Search by exercise name..."
        data={data}
        facetedFilters={FACETED_FILTERS}
      />
    </section>
  );
}
