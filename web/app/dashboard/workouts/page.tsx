"use client";

import { DataTable } from "@/components/tables/data-table";
import { useFetchWorkouts } from "./hooks/useFetchWorkouts";
import { WORKOUT_COLUMNS } from "./components/tables/columns";
import { FACETED_FILTERS } from "./data/faceted-filters";
import CreateWorkoutDialog from "./components/dialogs/create";
import { useState } from "react";

export default function WorkoutsPage() {
  const { data } = useFetchWorkouts();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="mt-1">
      <DataTable
        columns={WORKOUT_COLUMNS}
        createFormDialog={
          <CreateWorkoutDialog
            isFormOpen={isFormOpen}
            useInternalTrigger={true}
            setIsFormOpen={setIsFormOpen}
          />
        }
        searchBarPlaceholder="Search by workout name..."
        data={data}
        facetedFilters={FACETED_FILTERS}
      />
    </section>
  );
}
