"use client";

import { DataTable } from "@/components/tables/data-table";
import { WorkoutCreateFormDialog } from "./components/forms/create";
import { useFetchWorkouts } from "./hooks/useFetchWorkouts";
import { WORKOUT_COLUMNS } from "./components/tables/columns";
import { FACETED_FILTERS } from "./data/faceted-filters";

export default function WorkoutsPage() {
  const { data } = useFetchWorkouts();

  return (
    <section className="mt-1">
      <DataTable
        columns={WORKOUT_COLUMNS}
        createFormDialog={<WorkoutCreateFormDialog />}
        searchBarPlaceholder="Search by workout name..."
        data={data}
        facetedFilters={FACETED_FILTERS}
      />
    </section>
  );
}
