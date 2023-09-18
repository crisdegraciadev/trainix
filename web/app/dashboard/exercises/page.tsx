"use client";

import { DataTable } from "../../../components/tables/data-table";
import { EXERCISES_COLUMNS } from "./components/tables/columns";
import { useFetchExercises } from "./hooks/use-fetch-exercises";
import { FACETED_FILTERS } from "./data/faceted-filter";
import CreateExerciseFormDialog from "./components/forms/create-exercise/create-exercise-form";
import { useState } from "react";
import CreateExerciseDialog from "./components/dialogs/create";

export default function ExercisesPage() {
  const { data } = useFetchExercises();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="mt-1">
      <DataTable
        columns={EXERCISES_COLUMNS}
        createFormDialog={
          <CreateExerciseDialog
            isFormOpen={isFormOpen}
            useInternalTrigger={true}
            setIsFormOpen={setIsFormOpen}
          />
        }
        searchBarPlaceholder="Search by exercise name..."
        data={data}
        facetedFilters={FACETED_FILTERS}
      />
    </section>
  );
}
